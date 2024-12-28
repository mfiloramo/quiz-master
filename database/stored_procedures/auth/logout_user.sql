-- STORED PROCEDURE TO LOGOUT A USER
CREATE PROCEDURE LogoutUser
    @UserId INT
AS
BEGIN
    -- LOGOUT IS A NO-OP SINCE SESSIONS ARE NOT TRACKED IN THE DATABASE
    -- THIS PROCEDURE EXISTS FOR CONSISTENCY AND POTENTIAL FUTURE EXTENSIONS
    PRINT 'User logged out successfully.';
END;
GO