export async function initiateKhaltiPayment(payload: any) {
  const url = `${process.env.KHALTI_BASE_URL || 'https://a.khalti.com/api/v2'}/epayment/initiate/`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  return response.json();
}

export async function lookupKhaltiPayment(pidx: string) {
  const url = `${process.env.KHALTI_BASE_URL || 'https://a.khalti.com/api/v2'}/epayment/lookup/`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pidx }),
  });
  
  return response.json();
}
