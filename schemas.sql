
CREATE TABLE members (
    member_id int Primary key AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    batch varchar(20) NOT NULL,
    department varchar(50) NOT NULL,
    section varchar(10) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    pwd varchar(8) NOT NULL UNIQUE,
    team varchar(50) NOT NULL,
    role_as varchar(255) DEFAULT 'user',
    is_admin tinyint(1) NOT NULL DEFAULT 0,
);


CREATE TABLE excom (
    induction_id int primary key AUTO_INCREMENT,  
    name varchar(100) NOT NULL,
    batch varchar(20) NOT NULL,
    department varchar(50) NOT NULL,
    section varchar(10) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    position varchar(50) NOT NULL unique
    
);



CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    s_name VARCHAR(255) NOT NULL,
    batch VARCHAR(500) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES society_events(event_id)
);


CREATE TABLE achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    achievement_title VARCHAR(20) NOT NULL,
    description VARCHAR(500) NOT NULL,
    date_of_achievement DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    announcement_title VARCHAR(50) NOT NULL UNIQUE,
    content VARCHAR(500) NOT NULL
);


CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    was_present TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE certifications (
    certification_id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT,
    person_name VARCHAR(30),
    certification_for VARCHAR(200) NOT NULL,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id)
);

CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    feedback_content VARCHAR(500) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE inductions (
    induction_id int primary key AUTO_INCREMENT,  
    name varchar(100) NOT NULL,
    batch varchar(20) NOT NULL,
    department varchar(50) NOT NULL,
    section varchar(10) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    position varchar(50) NOT NULL,
    
);


CREATE TABLE mentor (
    mentor_id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_user_id INT,
    mentor_name VARCHAR(30),
    mentor_email VARCHAR(50),
    FOREIGN KEY (mentor_user_id) REFERENCES users(user_id)
);


CREATE TABLE society_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(100) NOT NULL,
    about_event VARCHAR(500) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(20) NOT NULL,
    booking_price INT
);


