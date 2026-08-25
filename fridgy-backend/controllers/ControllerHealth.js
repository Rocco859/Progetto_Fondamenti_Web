exports.healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Fridgy API is running"
    });
};

//verifica se il serve funziona