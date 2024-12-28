-- STORED PROCEDURE TO REGISTER A NEW USER
CREATE PROCEDURE RegisterUser
    @Username NVARCHAR(50),
    @Email NVARCHAR(255),
    @Password NVARCHAR(255)
AS
BEGIN
    -- INSERT THE NEW USER INTO THE USERS TABLE
    INSERT INTO Users (username, email, password, created_at)
    VALUES (@Username, @Email, @Password, GETDATE());
END;
GO
