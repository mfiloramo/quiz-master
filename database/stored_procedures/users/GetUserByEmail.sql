-- STORED PROCEDURE TO FETCH A USER PROFILE BY ID
CREATE PROCEDURE GetUserByEmail
    @Email NVARCHAR(255)
AS
BEGIN
    -- RETRIEVE USER DETAILS BASED ON ID
    SELECT id, username, email, password, created_at
    FROM Users
    WHERE id = @Email;
END;
GO
