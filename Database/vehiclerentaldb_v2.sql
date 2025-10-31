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


INSERT INTO staff (full_name, role, phone_no, email, username, password, branch_id)
VALUES
('krishanthi', 'Manager', '0714609905', 'krishanthi@gmail.com', 'krishanthi', 'manager123', 1);




CREATE OR REPLACE VIEW vehicle_view AS
SELECT 
    v.vehicle_id,
    v.registration_no,
    v.brand,
    v.model,
    v.vehicle_type,
    v.daily_rate,
    v.availability_status,
    b.branch_name
FROM vehicle v
JOIN branch b ON v.branch_id = b.branch_id;

#--------------------view for Customer------------------------------


CREATE OR REPLACE VIEW vehicle_dashboard_view AS
SELECT
    v.vehicle_type AS Type,
    v.brand AS Brand,
    v.model AS Model,
    v.registration_no AS Registration,
    v.daily_rate AS `Daily Rate`,
    b.branch_name AS `Branch Name`,
    v.availability_status AS Status
FROM vehicle v
JOIN branch b ON v.branch_id = b.branch_id;

#----------------Trigger1 for update_vehicle_status_after_rental_change---------------------- 

DELIMITER $$

CREATE TRIGGER update_vehicle_status_after_rental_change
AFTER UPDATE ON rental
FOR EACH ROW
BEGIN
    -- If rental becomes Completed → Vehicle is now Rented
    IF NEW.rental_status = 'Completed' THEN
        UPDATE vehicle
        SET availability_status = 'Rented'
        WHERE vehicle_id = NEW.vehicle_id;
    END IF;

    -- If rental is Completed or Cancelled → Vehicle becomes Available
    IF NEW.rental_status = 'Cancelled' THEN
        UPDATE vehicle
        SET availability_status = 'Available'
        WHERE vehicle_id = NEW.vehicle_id;
    END IF;
END$$

DELIMITER ;
#------------test------------
UPDATE rental
SET rental_status = 'Completed'
WHERE rental_id = 42;

SELECT availability_status FROM vehicle WHERE vehicle_id = (SELECT vehicle_id FROM rental WHERE rental_id = 42);



#--------------------Trigger2 for rental updates-------------------------------
CREATE TABLE rental_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT,
    action VARCHAR(50),
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER rental_audit_trigger
AFTER UPDATE ON rental
FOR EACH ROW
BEGIN
    INSERT INTO rental_audit (rental_id, action, changed_by)
    VALUES (NEW.rental_id, CONCAT('Status changed to ', NEW.rental_status), 'System Trigger');
END$$

DELIMITER ;


-- Create a view for Rental Audit History
CREATE VIEW rental_audit_view AS
SELECT 
    id as Id,
    rental_id as RentalId,
    action as Action,
    changed_by as ChangedBy,
    changed_at as ChangedAt
FROM rental_audit
ORDER BY changed_at DESC;


CREATE VIEW rental_audit_view AS
SELECT 
    id AS id,
    rental_id AS rental_id,
    action AS action,
    changed_by AS changed_by,
    changed_at AS changed_at
FROM rental_audit
ORDER BY changed_at DESC;




CREATE OR REPLACE VIEW rental_summary_view AS
SELECT 
    r.rental_id AS Rental_ID,
    c.full_name AS Customer_Name,
    v.registration_no AS Vehicle_Registration,
    v.brand AS Vehicle_Brand,
    v.model AS Vehicle_Model,
    b.branch_name AS Branch_Name,
    r.start_date AS Start_Date,
    r.end_date AS End_Date,
    r.total_amount AS Total_Amount,
    r.rental_status AS Rental_Status,
    r.created_at AS Created_At
FROM rental r
JOIN customer c ON r.customer_id = c.customer_id
JOIN vehicle v ON r.vehicle_id = v.vehicle_id
LEFT JOIN branch b ON v.branch_id = b.branch_id
ORDER BY r.created_at DESC;


