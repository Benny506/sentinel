import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { removeAlert } from '../../store/uiSlice'

const Alert = ({ alert }) => {
    const dispatch = useDispatch()
    const { id, type, title, message, duration = 5000 } = alert

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                dispatch(removeAlert(id))
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [id, duration, dispatch])

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="text-sentinel-emerald" size={20} />
            case 'danger': return <AlertCircle className="text-sentinel-crimson" size={20} />
            default: return <Info className="text-sentinel-indigo" size={20} />
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`sv-alert-card sv-alert-${type || 'info'}`}
        >
            <div className="sv-alert-scan" />
            
            <div className="d-flex gap-3 align-items-start">
                <div className="mt-1">{getIcon()}</div>
                <div className="flex-grow-1">
                    {title && <h6 className="mono smaller uppercase fw-bold mb-1 tracking-wider">{title}</h6>}
                    <p className="smaller text-dim m-0 leading-relaxed">{message}</p>
                </div>
                <button 
                    onClick={() => dispatch(removeAlert(id))}
                    className="btn btn-link p-0 text-dim hover-white transition-all"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    )
}

export default Alert
