CREATE DATABASE IF NOT EXISTS bamazon;
USE bamazon;
CREATE TABLE products(
	item_id INTEGER AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL(10,2),
	stock_quantity INTEGER NOT NULL,
	PRIMARY KEY(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Canon 7D", "Camera", 700, 2),
("Nikon D810", "Camera", 1100, 1),
("DJI Mavic", "Drone", 999, 15),
("DJI Phantom 4", "Drone", 1400, 3),
("Vello cable release", "Accessories",49, 23),
("Manfroto carbon tripod", "Accessories", 350, 19),
("Adobe Photoshop CC", "Software", 99, 856),
("Adobe Lightroom CC", "Software", 99, 543),
("Apple MBP 2017", "Laptop", 1299, 3),
("Apple IMAC pro 2017", "Desktop", 3999, 2),
("Apple iphone X", "Mobile", 999, 10000)
 