-- @param {String} $1:userId
SELECT 
    c."name" AS "category", 
    SUM(s."duration") AS "totalDuration"
FROM "FocusSession" AS s
JOIN "Category" AS c ON s."categoryId" = c."id"
WHERE s."userId" = $1
GROUP BY c."name"
ORDER BY "totalDuration" DESC