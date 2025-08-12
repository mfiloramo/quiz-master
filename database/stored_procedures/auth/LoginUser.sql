-- STORED PROCEDURE TO LOGIN A USER
CREATE PROCEDURE [dbo].[LoginUser]
   @Email NVARCHAR(255),
   @Password NVARCHAR(255)
AS
BEGIN
   -- FETCH THE USER WITH THE PROVIDED EMAIL AND PASSWORD
   SELECT id, username, email, password, isActive
   FROM Users
   WHERE email = @Email AND password = @Password;
END;
GO
