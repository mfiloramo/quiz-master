-- STORED PROCEDURE TO END A GAME SESSION
CREATE PROCEDURE EndSession
    @SessionId INT
AS
BEGIN
    -- UPDATE THE SESSION STATUS TO 'ENDED'
    UPDATE Sessions
    SET status = 'ended'
    WHERE id = @SessionId;
END;
GO