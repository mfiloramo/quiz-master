-- STORED PROCEDURE TO FETCH A USER PROFILE BY ID
CREATE PROCEDURE [dbo].[GetUserByEmail]
    @Email NVARCHAR(255)
AS
BEGIN
    -- RETRIEVE USER DETAILS BASED ON ID
    SELECT id, username, email, password, created_at, isActive, account_type
    FROM Users
    WHERE email = @Email;
END;
GO
