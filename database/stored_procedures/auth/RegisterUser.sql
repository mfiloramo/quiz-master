-- STORED PROCEDURE TO REGISTER A NEW USER
CREATE PROCEDURE [dbo].[RegisterUser]
    @Username NVARCHAR(50),
    @Email NVARCHAR(255),
    @Password NVARCHAR(255),
	@AccountType NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- INSERT THE NEW USER INTO THE USERS TABLE
    INSERT INTO Users (username, email, password, account_type, created_at, isActive)
    VALUES (@Username, @Email, @Password, @AccountType, GETDATE(), 0);

    -- RETURN THE NEW USER'S ID
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

