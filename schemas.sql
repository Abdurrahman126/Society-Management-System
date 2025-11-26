

create DATABASE Society_Management_System;
use  Society_Management_System;


CREATE TABLE society_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(100) NOT NULL,
    about_event VARCHAR(500) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(20) NOT NULL,
    booking_price INT
);

CREATE TABLE event_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    event_title VARCHAR(100),
    operation VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER after_event_insert
AFTER INSERT ON society_events
FOR EACH ROW
BEGIN
    INSERT INTO event_audit (event_id, event_title, operation)
    VALUES (NEW.event_id, NEW.event_title, 'INSERT');
END$$

DELIMITER ;

INSERT INTO society_events (event_title, about_event, event_date, venue)
VALUES 
('Annual Dinner', 'An evening of celebration and networking for all society members.', '2024-12-20', 'Grand Ballroom');

INSERT INTO society_events (event_title, about_event, event_date, venue)
VALUES 
('Beach Party', 'A fun-filled day at the beach with games, music, and food.', '2024-12-22', 'Sunny Shores Beach');

INSERT INTO society_events (event_title, about_event, event_date, venue)
VALUES 
('Culture Day', 'A showcase of diverse cultural traditions, food, and performances.', '2024-12-25', 'Cultural Auditorium');




CREATE TABLE bookings (
    event_id INT NOT NULL,
    roll_number VARCHAR(255) NOT NULL,
    s_name VARCHAR(255) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    transaction_id INT UNIQUE,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (event_id, roll_number),
    FOREIGN KEY (event_id) REFERENCES society_events(event_id) ON DELETE CASCADE
);

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    announcement_title VARCHAR(50) NOT NULL UNIQUE,
    content VARCHAR(500) NOT NULL,
    link VARCHAR(255) DEFAULT NULL
);

CREATE TABLE forum (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    likes INT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE inductions (
    roll_number VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    position VARCHAR(50) NOT NULL,
    past_experience TEXT,
    motivation TEXT
);

CREATE TABLE excom (
    roll_number VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    position VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (roll_number) REFERENCES inductions(roll_number)
);

CREATE TABLE members (
    roll_number VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    section VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    team VARCHAR(50) NOT NULL
);





CREATE TABLE admin (
    roll_number VARCHAR(255) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    FOREIGN KEY (roll_number) REFERENCES excom(roll_number)
);


CREATE TABLE meetings (
    meeting_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    venue varchar(100) not null,
    meeting_date date not null
    
);

CREATE TABLE attendance (
    meeting_id INT,
    member_id VARCHAR(255),
    attendance BOOLEAN NOT NULL,
    PRIMARY KEY (meeting_id, member_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id),
    FOREIGN KEY (member_id) REFERENCES members(roll_number)
);
Create table induction_toggle(
islive tinyint not null
);
