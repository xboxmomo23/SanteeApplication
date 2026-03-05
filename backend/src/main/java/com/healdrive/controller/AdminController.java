package com.healdrive.controller;

import com.healdrive.dto.TrajetResponse;
import com.healdrive.model.Utilisateur;
import com.healdrive.model.enums.RoleUtilisateur;
import com.healdrive.repository.UtilisateurRepository;
import com.healdrive.service.EmailService;
import com.healdrive.service.TrajetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;
    private final EmailService emailService;
    private final TrajetService trajetService;
    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @GetMapping("/chauffeurs/en-attente")
    public ResponseEntity<List<Map<String, Object>>> getChauffeursEnAttente() {
        List<Map<String, Object>> result = utilisateurRepository
                .findByRoleAndStatutCompteOrderByDateCreationAsc(RoleUtilisateur.CHAUFFEUR, "EN_ATTENTE")
                .stream()
                .map(this::toAdminRow)
                .toList();
        return ResponseEntity.ok(result);
    }

    @PutMapping("/chauffeurs/{id}/valider")
    public ResponseEntity<?> validerChauffeur(@PathVariable UUID id) {
        try {
            Utilisateur utilisateur = utilisateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + id));

            if (utilisateur.getRole() != RoleUtilisateur.CHAUFFEUR) {
                throw new RuntimeException("Cet utilisateur n'est pas un chauffeur.");
            }

            utilisateur.setStatutCompte("ACTIF");
            utilisateur.setActif(true);
            utilisateurRepository.save(utilisateur);
            emailService.envoyerValidationCompte(utilisateur.getEmail());

            return ResponseEntity.ok(Map.of(
                    "message", "Chauffeur valide avec succes.",
                    "id", utilisateur.getId(),
                    "statutCompte", utilisateur.getStatutCompte()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/trajets/tous")
    public ResponseEntity<List<TrajetResponse>> getTousLesTrajets() {
        return ResponseEntity.ok(trajetService.getTousTrajetsAdmin());
    }

    @GetMapping("/documents/{userId}/{docType}")
    public ResponseEntity<Resource> getFile(@PathVariable UUID userId, @PathVariable String docType) {
        try {
            Optional<Path> resolvedFile = resolveDocumentPath(userId, docType);
            if (resolvedFile.isEmpty() || !Files.exists(resolvedFile.get())) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = resolvedFile.get().toAbsolutePath().normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = detectContentType(filePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filePath.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Map<String, Object> toAdminRow(Utilisateur u) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", u.getId());
        row.put("nom", u.getNom());
        row.put("prenom", u.getPrenom());
        row.put("email", u.getEmail());
        row.put("telephone", u.getTelephone());
        row.put("role", u.getRole().name());
        row.put("statutCompte", u.getStatutCompte());
        row.put("dateCreation", u.getDateCreation());
        row.put("fichierPermis", hasDocument(u.getId(), "permis"));
        row.put("fichierIdentite", hasDocument(u.getId(), "identite"));
        row.put("fichierAssurance", hasDocument(u.getId(), "assurance"));
        row.put("fichierCarteGrise", hasDocument(u.getId(), "carte-grise"));
        return row;
    }

    private boolean hasDocument(UUID userId, String docType) {
        return resolveDocumentPath(userId, docType)
                .map(Files::exists)
                .orElse(false);
    }

    private Optional<Path> resolveDocumentPath(UUID userId, String docTypeRaw) {
        String docType = normalizeDocType(docTypeRaw);
        String baseName = switch (docType) {
            case "permis" -> "permis";
            case "identite" -> "identite";
            case "assurance" -> "assurance";
            case "carte-grise" -> "carte-grise";
            default -> null;
        };
        if (baseName == null) {
            return Optional.empty();
        }

        Path root = Paths.get(uploadDir);
        Path userDir = root.resolve(userId.toString());
        List<String> extensions = List.of("pdf", "jpg", "jpeg", "png");

        for (String ext : extensions) {
            Path nested = userDir.resolve(baseName + "." + ext);
            if (Files.exists(nested)) return Optional.of(nested);
        }
        for (String ext : extensions) {
            Path nestedUnderscore = userDir.resolve(baseName.replace("-", "_") + "." + ext);
            if (Files.exists(nestedUnderscore)) return Optional.of(nestedUnderscore);
        }
        for (String ext : extensions) {
            Path flat = root.resolve(userId + "_" + baseName + "." + ext);
            if (Files.exists(flat)) return Optional.of(flat);
        }
        for (String ext : extensions) {
            Path flatUnderscore = root.resolve(userId + "_" + baseName.replace("-", "_") + "." + ext);
            if (Files.exists(flatUnderscore)) return Optional.of(flatUnderscore);
        }

        return Optional.empty();
    }

    private String normalizeDocType(String docTypeRaw) {
        return String.valueOf(docTypeRaw)
                .trim()
                .toLowerCase(Locale.ROOT)
                .replace("_", "-");
    }

    private String detectContentType(Path filePath) {
        try {
            String probe = Files.probeContentType(filePath);
            if (probe != null && !probe.isBlank()) return probe;
        } catch (Exception ignored) {
        }

        String name = filePath.getFileName().toString().toLowerCase(Locale.ROOT);
        if (name.endsWith(".pdf")) return "application/pdf";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }
}
