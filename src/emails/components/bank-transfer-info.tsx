export const BankTransferInfo = () => {
  return (
    <>
      <p>Por favor, transfiera el monto de <span className="font-bold">{'{{total}}'}</span> a la siguiente cuenta:</p>
      <p>
        <span className="font-semi">Alias</span>: facu.exa.mp
      </p>
      <p>
        <span className="font-semi">CVU</span>: 0000003100019347000871
      </p>
      <p>
        <span className="font-semi">CUIT</span>: 20-25739618-6
      </p>
      <p>Una vez realizada la transferencia, por favor responder a este email adjuntando el comprobante.</p>
    </>
  )
}
