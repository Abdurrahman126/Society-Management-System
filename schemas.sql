-- Table for society events
CREATE TABLE society_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(100) NOT NULL,
    about_event VARCHAR(500) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(20) NOT NULL,
    booking_price INT
);

-- Table for bookings
CREATE TABLE bookings (
    event_id INT NOT NULL,
    roll_number VARCHAR(255) NOT NULL,
    s_name VARCHAR(255) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    transaction_id INT UNIQUE,
    email varchar(100) not null;
    PRIMARY KEY (event_id, roll_number),
    FOREIGN KEY (event_id) REFERENCES society_events(event_id)
);

-- Table for announcements
CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    announcement_title VARCHAR(50) NOT NULL UNIQUE,
    content VARCHAR(500) NOT NULL,
    link VARCHAR(255) DEFAULT NULL
);

-- Table for forum posts
CREATE TABLE forum (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for inductions
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

-- Table for executive committee (excom)
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

-- Table for members
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

-- Table for teams
CREATE TABLE teams (
    roll_number VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table for admin (assuming excom members can be admins)
CREATE TABLE admin (
    roll_number VARCHAR(255) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    FOREIGN KEY (roll_number) REFERENCES excom(roll_number)
);

-- Table for meetings
CREATE TABLE meetings (
    meeting_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL
);

-- Table for attendance records
CREATE TABLE attendance (
    meeting_id INT,
    member_id VARCHAR(255),
    attendance BOOLEAN NOT NULL,
    PRIMARY KEY (meeting_id, member_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id),
    FOREIGN KEY (member_id) REFERENCES members(roll_number)
);