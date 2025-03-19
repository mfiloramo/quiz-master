-- CREATE DATABASE
CREATE DATABASE QuizMasterApp;
GO

-- USE THE DATABASE
USE QuizMasterApp;
GO

-- CREATE USERS TABLE
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- CREATE QUIZZES TABLE
CREATE TABLE Quizzes (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    title NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO

-- CREATE QUESTIONS TABLE
CREATE TABLE Questions (
    id INT PRIMARY KEY IDENTITY(1,1),
    quiz_id INT NOT NULL,
    question NVARCHAR(MAX) NOT NULL,
    options NVARCHAR(MAX) NOT NULL, -- JSON-like format for programmatic use
    correct NVARCHAR NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(id) ON DELETE CASCADE
);
GO

-- CREATE SESSIONS TABLE
CREATE TABLE Sessions (
    id INT PRIMARY KEY IDENTITY(1,1),
    quiz_id INT NOT NULL,
    host_user_id INT NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'created', -- Enum-like behavior: 'created', 'ongoing', 'ended'
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(id),
    FOREIGN KEY (host_user_id) REFERENCES Users(id)
);
GO

-- CREATE PLAYER_ANSWERS TABLE
CREATE TABLE Player_Answers (
    id INT PRIMARY KEY IDENTITY(1,1),
    session_id INT NOT NULL,
    player_id INT NOT NULL,
    question_id INT NOT NULL,
    answer INT NOT NULL,
    is_correct BIT NOT NULL,
    score INT DEFAULT 0, -- Defaults to 0
    FOREIGN KEY (session_id) REFERENCES Sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE NO ACTION -- Removed cascading delete
);
GO

-- CREATE PLAYERS TABLE
CREATE TABLE Players (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    session_id INT NOT NULL,
    name NVARCHAR(50) NOT NULL,
    joined_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES Sessions(id) ON DELETE CASCADE
);
GO
