DROP DATABASE IF EXISTS rpg_list;
CREATE DATABASE rpg_list;
USE rpg_list;

CREATE TABLE rpgs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    system VARCHAR(100),
    setting VARCHAR(100),
    product_type VARCHAR(100),
    product_form VARCHAR(100),
    is_read VARCHAR(25),
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO rpgs (name, system, setting, product_type, product_form, is_read, genre) VALUES
    ("Hellfrost Action Deck", "Savage Worlds", "Hellfrost", "Supplement", "pdf", "No", "Fantasy");