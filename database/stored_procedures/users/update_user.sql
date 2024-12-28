-- STORED PROCEDURE TO UPDATE A USER PROFILE
CREATE PROCEDURE UpdateUser
    @UserId INT,
    @Username NVARCHAR(50),
    @Email NVARCHAR(255)
AS
BEGIN
    -- UPDATE THE USER RECORD
    UPDATE Users
    SET username = @Username, email = @Email
    WHERE id = @UserId;
END;
GO
