INSERT INTO vehicle (brand, model, vehicle_type, daily_rate, availability_status, registration_no, branch_id)
VALUES
-- 🚗 Cars
('Toyota', 'Corolla', 'Car', 8000.00, 'Available', 'WP-CAD-4521', 1),
('Honda', 'Civic', 'Car', 8500.00, 'Rented', 'WP-CBK-2314', 1),
('Nissan', 'Sunny', 'Car', 7500.00, 'Available', 'CP-GHU-9876', 2),

-- 🚙 SUVs
('Suzuki', 'Vitara', 'SUV', 10000.00, 'Available', 'WP-KDK-8734', 2),
('Mitsubishi', 'Outlander', 'SUV', 11500.00, 'Maintenance', 'WP-GLX-5532', 3),

-- 🚐 Vans
('Toyota', 'Hiace', 'Van', 12000.00, 'Available', 'SP-ABY-1213', 3),
('Nissan', 'Caravan', 'Van', 11800.00, 'Rented', 'SP-BCC-8821', 1),

-- 🏍️ Motorbikes
('Yamaha', 'FZ-S', 'Bike', 4500.00, 'Available', 'WP-MOT-9021', 2),
('Bajaj', 'Pulsar 150', 'Bike', 4200.00, 'Available', 'WP-BIK-2213', 3),

-- 🚚 Trucks
('Isuzu', 'Elf', 'Truck', 15000.00, 'Available', 'CP-TRK-1022', 2),
('Tata', 'LPT 709', 'Truck', 14500.00, 'Rented', 'WP-TAT-6721', 1);

INSERT INTO branch (branch_name, location, contact_no)
VALUES
('Colombo Branch', 'Colombo', '011-2345678'),
('Galle Branch', 'Galle', '091-2245789'),
('Kandy Branch', 'Kandy', '081-2456789');

