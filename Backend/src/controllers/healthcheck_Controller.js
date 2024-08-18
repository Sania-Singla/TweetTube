const healthCheck = async (req,res) => {
    return res.status(200).json({message:"everything is ok, Health is good."});
}

module.exports = healthCheck;