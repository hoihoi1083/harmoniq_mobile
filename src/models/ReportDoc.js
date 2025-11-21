import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    nianzhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    yuezhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    rizhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    shizhuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    yunchengData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    jiajuData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
})
const ReportDoc = mongoose.models.ReportDoc || mongoose.model('ReportDoc', reportSchema);

export default ReportDoc; 