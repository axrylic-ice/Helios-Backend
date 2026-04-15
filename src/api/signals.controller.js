import { getLatestSignalService } from "../services/signals.service.js";

// get latest signal controller
export const getLatestSignal = async (req, res, next ) => {
    try {
        // extract teh fx_pair from the query string
        const { fx_pair } = req.query;

        // pass the fx_pair to the service
        const signal = await getLatestSignalService(fx_pair);

        res.status(200).json({
            status: 'success',
            data: { signal: {...signal} },
        });
    } catch (err) {
        next(err);
    }
};