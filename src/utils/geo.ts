export function getDistanceSqlField(
  baseLat: number,
  baseLng: number,
): { sql: string; params: number[] } {
  return {
    sql: `
      (
        6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(A.latitude)) *
          COS(RADIANS(A.longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(A.latitude))
        )
      ) AS distance
    `,
    params: [baseLat, baseLng, baseLat],
  };
}

export function buildPriceJoinAndSelect(
  type: string,
  minPrice?: number,
  maxPrice?: number,
) {
  const today = new Date().toISOString().split('T')[0];
  const sqlParams: (string | number)[] = [];
  let priceSelect = '';
  let priceJoins = '';
  const priceFilters: string[] = [];

  if (type === 'corporate') {
    priceSelect = 'CR.monthly_rate AS rate';
    priceJoins = `JOIN CorporateRate CR ON A.id = CR.apartment_id AND CR.start_date <= ? AND CR.end_date >= ?`;
    sqlParams.push(today, today);

    if (minPrice) {
      priceFilters.push('CR.monthly_rate >= ?');
      sqlParams.push(minPrice);
    }
    if (maxPrice) {
      priceFilters.push('CR.monthly_rate <= ?');
      sqlParams.push(maxPrice);
    }
  } else if (type === 'tourist') {
    priceSelect = 'TR.daily_rate AS rate';
    priceJoins = `JOIN TouristRate TR ON A.id = TR.apartment_id AND TR.start_date <= ? AND TR.end_date >= ?`;
    sqlParams.push(today, today);

    if (minPrice) {
      priceFilters.push('TR.daily_rate >= ?');
      sqlParams.push(minPrice);
    }
    if (maxPrice) {
      priceFilters.push('TR.daily_rate <= ?');
      sqlParams.push(maxPrice);
    }
  } else {
    priceSelect = `
      CASE
        WHEN A.apartment_type = 'corporate' THEN CR.monthly_rate
        ELSE TR.daily_rate
      END AS rate
    `;
    priceJoins = `
      LEFT JOIN CorporateRate CR ON A.id = CR.apartment_id AND CR.start_date <= ? AND CR.end_date >= ?
      LEFT JOIN TouristRate TR ON A.id = TR.apartment_id AND TR.start_date <= ? AND TR.end_date >= ?
    `;
    sqlParams.push(today, today, today, today);

    if (minPrice && maxPrice) {
      priceFilters.push(`
        (
          (A.apartment_type = 'corporate' AND CR.monthly_rate BETWEEN ? AND ?)
          OR
          (A.apartment_type = 'tourist' AND TR.daily_rate BETWEEN ? AND ?)
        )
      `);
      sqlParams.push(minPrice, maxPrice, minPrice, maxPrice);
    }
  }

  return {
    priceSelect,
    priceJoins,
    priceFilters,
    sqlParams,
  };
}
