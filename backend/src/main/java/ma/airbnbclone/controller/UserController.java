package ma.airbnbclone.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.User;
import ma.airbnbclone.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<User> profil(@PathVariable String id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // POST /api/users
    @PostMapping
    public ResponseEntity<User> creer(@Valid @RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.creer(user));
    }

    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<User> modifier(@PathVariable String id,
                                         @Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.modifier(id, user));
    }
}
