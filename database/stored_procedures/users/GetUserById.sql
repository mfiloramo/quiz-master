-- STORED PROCEDURE TO FETCH A USER PROFILE BY ID
CREATE PROCEDURE [dbo].[GetUserById]
    @UserId INT
AS
BEGIN
    -- RETRIEVE USER DETAILS BASED ON ID
    SELECT id, username, email, password, created_at
    FROM Users
    WHERE id = @UserId;
END;
GO
