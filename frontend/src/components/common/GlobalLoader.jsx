import React from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Activity } from 'lucide-react'

const GlobalLoader = () => {
    const isVisible = useSelector((state) => state.ui.globalLoading)
    const title = useSelector((state) => state.ui.globalLoadingTitle)
    const message = useSelector((state) => state.ui.globalLoadingMessage)

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="sv-loader-overlay"
                >
                    <div className="sv-loader-hex">
                        <div className="sv-loader-pulse" />
                        <div className="position-absolute start-50 top-50 translate-middle">
                            <Shield size={48} className="text-sentinel-indigo animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <motion.h4
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mono uppercase fw-bold tracking-tighter"
                        >
                            {title || 'SYSTEM SYNCING'}
                        </motion.h4>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="d-flex align-items-center justify-content-center gap-2 text-sentinel-emerald mono smaller uppercase tracking-widest mt-2"
                        >
                            <Activity size={12} className="animate-pulse" />
                            {message || 'Calibrating supervised intelligence...'}
                        </motion.div>
                    </div>

                    {/* Progress Bar Layer */}
                    <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                            className="h-100 bg-sentinel-indigo"
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{ width: '40%', boxShadow: '0 0 15px var(--sentinel-indigo)' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default GlobalLoader
