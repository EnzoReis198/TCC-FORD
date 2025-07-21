const db = require('../db/cars_db')
const listarVeiculos = async (req,res)=>{
    try {
        const veicles = db
        return res.status(200).json(veicles)
    } catch (error) {
        console.error("Erro no login:", error);
    return res.status(500).json({ mensage: "Erro interno" });
    }
}

const listarVeiculoID = async (req,res)=>{
    const id = req.params.id;
    console.log(id)
    try {
        const veiculo = db.vehicle.find(v => v.id == id);
        console.log(veiculo)
        if (!veiculo) {
            return res.status(404).json({ mensagem: 'Veículo não encontrado' });
        }
        return res.status(200).json(veiculo);
        
        
    } catch (error) {
        console.error("Erro no login:", error);
    return res.status(500).json({ mensage: "Erro interno" });
    }
}

module.exports = {
  listarVeiculos,
  listarVeiculoID
};