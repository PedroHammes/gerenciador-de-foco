-- @param {String} $1:userId O id do usuário a quem pertence a sessão
SELECT 
    SUM(duration) AS "totalDuration", 
    DATE_TRUNC('day', "startTime") AS "day"
FROM "FocusSession"
WHERE "userId" = $1
GROUP BY DATE_TRUNC('day', "startTime")
ORDER BY "day" ASC