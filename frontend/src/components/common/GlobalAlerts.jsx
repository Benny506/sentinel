import React from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import Alert from './Alert'

const GlobalAlerts = () => {
    const alerts = useSelector((state) => state.ui.alerts)

    return (
        <div className="sv-alerts">
            <AnimatePresence mode="popLayout">
                {alerts.map((alert) => (
                    <Alert key={alert.id} alert={alert} />
                ))}
            </AnimatePresence>
        </div>
    )
}

export default GlobalAlerts
