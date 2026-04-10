import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Spinner, Alert, Accordion } from 'react-bootstrap';
import { Shield, ShieldAlert, ShieldCheck, Activity, BarChart3, Zap, RefreshCw, Layers, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalLoading, addAlert } from './store/uiSlice';
import GlobalLoader from './components/common/GlobalLoader';
import GlobalAlerts from './components/common/GlobalAlerts';
import { featureCategories, getLabel } from './utils/featureLabels';
import LandingPage from './components/LandingPage';
import Logo from './components/common/Logo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Configuration for Production Deployment
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ModelLeaderboard = ({ metrics }) => {
  if (!metrics) return null;

  const data = Object.entries(metrics).map(([name, vals]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    auprc: vals.auprc * 100,
    f1: vals.f1 * 100,
    recall: vals.recall * 100
  }));

  return (
    <div className="h-100">
      <h6 className="mono smaller uppercase text-secondary mb-4 d-flex align-items-center gap-2">
        <BarChart3 size={16} /> Strategy Leaderboard (AUPRC %)
      </h6>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
          <YAxis stroke="#94a3b8" fontSize={10} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#6366f1' }}
          />
          <Bar dataKey="auprc" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#6366f1' : 'rgba(99, 102, 241, 0.3)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TransactionSimulator = ({ onDetect, isDetecting }) => {
  const [features, setFeatures] = useState(new Array(30).fill(0));
  const [isRandomizing, setIsRandomizing] = useState(false);
  
  // Consolidated Synthetic Pulse for realism
  const applyPreset = () => {
    setIsRandomizing(true);
    
    setTimeout(() => {
      let newFeats = new Array(30).fill(0);
      newFeats = newFeats.map(() => (Math.random() * 0.4) - 0.2);

      // Randomize severity: 4 to 12 features, 2.3 to 4.5 intensity
      const numDrifted = Math.floor(Math.random() * 9) + 4;
      const driftIntensity = (Math.random() * 2.2) + 2.3;
      
      const indexes = Array.from({ length: 28 }, (_, i) => i);
      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
      }
      
      const targetIndices = indexes.slice(0, numDrifted);
      targetIndices.forEach(idx => {
        newFeats[idx] = (Math.random() * 1.5) + driftIntensity;
      });

      newFeats[28] = (Math.random() * 400 + 45); // Randomized Amount
      setFeatures(newFeats);
      setIsRandomizing(false);
    }, 800);
  };

  const handleChange = (idx, val) => {
    const next = [...features];
    next[idx] = parseFloat(val);
    setFeatures(next);
  };

  const IconMap = { Activity, Shield, Layers, Zap, BarChart3 };

  return (
    <div className="p-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h6 className="mono smaller uppercase text-secondary m-0">Transaction Simulator</h6>
          <p className="smaller text-dim m-0 text-white" style={{ fontSize: '0.65rem' }}>Inject anomaly signals per pillar</p>
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-end">
          <Button 
            size="sm" 
            variant="outline-sentinel" 
            className="text-white smaller py-0 border-opacity-25 mono d-flex align-items-center gap-1" 
            onClick={applyPreset}
            disabled={isRandomizing}
          >
            {isRandomizing ? (
              <Spinner animation="border" size="sm" style={{ width: '10px', height: '10px', borderWidth: '1px' }} />
            ) : (
              <Zap size={10} />
            )}
            {isRandomizing ? 'SYNTHESIZING...' : 'RANDOMIZE THREAT'}
          </Button>
        </div>
      </div>

      <Accordion defaultActiveKey="IDENTITY" className="sentinel-accordion mb-4">
        {Object.entries(featureCategories).map(([id, cat]) => {
          const Icon = IconMap[cat.icon];
          return (
            <Accordion.Item eventKey={id} key={id} className="bg-transparent border-0 mb-2">
              <Accordion.Header className="glass-panel p-0 rounded-3">
                <div className="d-flex align-items-center gap-2 w-100 py-1">
                  <Icon size={14} className="text-sentinel-indigo" />
                  <span className="mono smaller uppercase fw-bold tracking-wider">{cat.title}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="px-0 py-3 border-0">
                <Row className="g-2">
                  {cat.features.map((key) => {
                    const idx = key === 'Amount' ? 28 : (key === 'Time' ? 29 : parseInt(key.slice(1)) - 1);
                    return (
                      <Col key={key} xs={6}>
                        <label className="smaller mono text-white text-truncate d-block mb-1" style={{ fontSize: '0.6rem' }}>
                          {getLabel(key)}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="input-sentinel w-100 py-1 px-2 smaller mono"
                          value={features[idx]}
                          onChange={(e) => handleChange(idx, e.target.value)}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <Button
        className="btn-sentinel w-100 d-flex align-items-center justify-content-center gap-2"
        onClick={() => onDetect(features)}
      >
        <Shield size={18} /> Initiate Scan Sequence
      </Button>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [metrics, setMetrics] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [status, setStatus] = useState('initializing');
  const isLoading = useSelector((state) => state.ui.globalLoading);
  const systemState = isLoading ? 'loading' : status;

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${API_BASE}/metrics`);
      setMetrics(res.data.metrics);
      setStatus('active');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleTrain = async () => {
    dispatch(setGlobalLoading({
      loading: true,
      title: 'RECALIBRATING INTELLIGENCE',
      message: 'Synthesizing new datasets and retraining the XGBoost champion...'
    }));
    try {
      const res = await axios.post(`${API_BASE}/train`);
      setMetrics(res.data.metrics);
      dispatch(addAlert({
        type: 'success',
        title: 'CALIBRATION COMPLETE',
        message: 'The supervised ML engine has been successfully retrained.'
      }));
    } catch (err) {
      dispatch(addAlert({
        type: 'danger',
        title: 'CALIBRATION FAILURE',
        message: 'The model engine could not be reached. Verify backend status.'
      }));
    } finally {
      dispatch(setGlobalLoading({ loading: false }));
    }
  };

  const handleDetect = async (features) => {
    dispatch(setGlobalLoading({
      loading: true,
      title: 'SENTINEL SCAN IN PROGRESS',
      message: 'Analyzing 30 feature dimensions for anomaly signatures...'
    }));
    setPrediction(null);
    try {
      const res = await axios.post(`${API_BASE}/detect`, { features });
      setPrediction(res.data);
      if (res.data.is_anomaly) {
        dispatch(addAlert({
          type: 'danger',
          title: 'ANOMALY DETECTED',
          message: 'High-probability fraud signature identified in transaction pulse.'
        }));
      } else {
        dispatch(addAlert({
          type: 'success',
          title: 'CLEAN SCAN',
          message: 'Transaction classified as LEGITIMATE with high confidence.'
        }));
      }
    } catch (err) {
      dispatch(addAlert({
        type: 'danger',
        title: 'SCAN FAILURE',
        message: 'The Sentinel engine experienced a serialization or connection error.'
      }));
    } finally {
      dispatch(setGlobalLoading({ loading: false }));
    }
  };

  return (
    <div className="app-sentinel min-vh-100">
      <GlobalLoader />
      <GlobalAlerts />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onLaunch={() => navigate('/dashboard')} />
            </motion.div>
          } />

          <Route path="/dashboard" element={
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Container className="py-5">
                <header className="mb-5 d-flex justify-content-between align-items-end border-bottom border-white border-opacity-10 pb-4">
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="p-3 glass-panel animate-pulse shadow-lg" style={{ borderColor: 'var(--sentinel-indigo)' }}>
                        <Logo size={48} />
                      </div>
                      <h1 className="display-5 fw-bold tracking-tighter m-0 mb-1">PROJECT <span style={{ color: 'var(--sentinel-indigo)' }}>SENTINEL</span></h1>
                    </div>
                    <p className="text-dim mono smaller uppercase tracking-widest m-0">
                      Financial Anomaly Detection Engine • Command Center
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="d-flex gap-2 justify-content-end mb-2">
                      <Button
                        variant="outline-secondary"
                        className="smaller mono px-3 py-1 border-opacity-20 hover-lift"
                        onClick={() => navigate('/')}
                      >
                        RETURN TO INTEL
                      </Button>
                      <Badge bg="none" className="border border-white border-opacity-10 rounded-pill px-3 py-2 mono smaller d-flex align-items-center gap-2">
                        <Activity size={12} className={systemState === 'active' ? 'text-sentinel-emerald' : 'text-sentinel-crimson'} />
                        CORE: {systemState.toUpperCase()}
                      </Badge>
                    </div>
                    <Button
                      variant="link"
                      className="text-sentinel-indigo smaller mono p-0 mt-1 text-decoration-none hover-lift"
                      onClick={handleTrain}
                    >
                      <RefreshCw size={12} className="me-2" />
                      RECALIBRATE MODELS
                    </Button>
                  </div>
                </header>

                <Row className="g-4">
                  <Col lg={4}>
                    <Card className="glass-panel p-4 h-100 shadow-xl overflow-hidden scanner position-relative">
                      <TransactionSimulator onDetect={handleDetect} />
                    </Card>
                  </Col>

                  <Col lg={8}>
                    <Row className="g-4">
                      <Col md={12}>
                        <Card className={`glass-panel p-4 shadow-xl transition-all ${prediction?.is_anomaly ? 'anomaly-alert' : ''}`} style={{ minHeight: '220px' }}>
                          <div className="d-flex justify-content-between align-items-start mb-4">
                            <h6 className="mono smaller uppercase text-secondary m-0">Sentinel Analysis Output</h6>
                            {prediction && (
                              <div className={`px-3 py-1 rounded-pill smaller mono fw-bold ${prediction.is_anomaly ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                                {prediction.prediction}
                              </div>
                            )}
                          </div>

                          <div className="d-flex align-items-center justify-content-center h-100 mt-2">
                            {!prediction ? (
                              <div className="text-center opacity-20 py-4">
                                <Layers size={48} className="mb-2" />
                                <p className="smaller mono">Awaiting Transaction Beam...</p>
                              </div>
                            ) : (
                              <div className="w-100 text-center">
                                <div className="display-1 fw-bold mb-0" style={{ color: prediction.is_anomaly ? 'var(--sentinel-crimson)' : 'var(--sentinel-emerald)' }}>
                                  {Math.round(prediction.fraud_probability * 100)}%
                                </div>
                                <p className="mono smaller uppercase text-dim tracking-widest mt-1">Anomaly Probability Score</p>

                                <div className="d-flex justify-content-center gap-4 mt-4">
                                  <div className="text-start">
                                    <label className="smaller text-white d-block mb-1">Status</label>
                                    <div className="fw-bold text-white d-flex align-items-center gap-2">
                                      {prediction.is_anomaly ? <ShieldAlert size={18} className="text-sentinel-crimson" /> : <ShieldCheck size={18} className="text-sentinel-emerald" />}
                                      {prediction.prediction}
                                    </div>
                                  </div>
                                  <div className="text-start border-start border-white border-opacity-10 ps-4">
                                    <label className="smaller text-white d-block mb-1">Performance</label>
                                    <div className="fw-bold mono text-white">
                                      {prediction.fraud_probability > 0.8 || prediction.fraud_probability < 0.2 ? 'HIGH CON' : 'INTERMED'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Col>

                      <Col md={12}>
                        <Card className="glass-panel p-4 shadow-xl" style={{ minHeight: '320px' }}>
                          <ModelLeaderboard metrics={metrics} />
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <footer className="mt-5 pt-4 text-center border-top border-white border-opacity-10">
                  <p className="smaller text-dim mono mb-0">Project Sentinel | Financial Intelligence Suite v1.0.0</p>
                </footer>
              </Container>
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;

const Badge = ({ children, bg, className }) => (
  <span className={`badge ${bg ? `bg-${bg}` : ''} ${className}`}>
    {children}
  </span>
);
