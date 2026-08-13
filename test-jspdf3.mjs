import('jspdf').then(m => {
  const doc = new m.jsPDF();
  console.log('doc created successfully');
})
