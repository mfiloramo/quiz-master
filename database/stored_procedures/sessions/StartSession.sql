-- STORED PROCEDURE TO START A GAME SESSION
CREATE PROCEDURE StartSession
    @SessionId INT
AS
BEGIN
    -- UPDATE THE SESSION STATUS TO 'ONGOING'
    UPDATE Sessions
    SET status = 'ongoing'
    WHERE id = @SessionId;
END;
GO