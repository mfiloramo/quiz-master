
-- STORED PROCEDURE TO FETCH THE LEADERBOARD FOR A SESSION
CREATE PROCEDURE GetLeaderboard
    @SessionId INT
AS
BEGIN
    -- FETCH PLAYERS' SCORES AND RANK THEM
    SELECT
        p.name AS PlayerName,
        pa.player_id AS PlayerId,
        SUM(pa.score) AS TotalScore,
        RANK() OVER (ORDER BY SUM(pa.score) DESC) AS Rank
    FROM
        Player_Answers pa
    INNER JOIN
        Players p ON pa.player_id = p.user_id AND pa.session_id = p.session_id
    WHERE
        pa.session_id = @SessionId
    GROUP BY
        p.name, pa.player_id
    ORDER BY
        TotalScore DESC;
END;
GO
