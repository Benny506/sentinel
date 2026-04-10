import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Shield, Activity, Zap, Layers, BarChart3, ChevronRight, Lock, Eye, Target, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './common/Logo';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="h-100"
  >
    <Card className="glass-panel p-4 h-100 border-opacity-10 hover-lift transition-all">
      <div className="p-3 glass-panel d-inline-block mb-3" style={{ borderColor: 'var(--sentinel-indigo)' }}>
        <Logo size={24} animate={false} />
      </div>
      <h5 className="mono uppercase text-white tracking-wider mb-3">{title}</h5>
      <p className="text-white smaller leading-relaxed mb-0">{description}</p>
    </Card>
  </motion.div>
);

const LandingPage = ({ onLaunch }) => {
  return (
    <div className="landing-wrapper overflow-hidden pb-5">
      {/* Hero Section */}
      <section className="hero-section py-5 mb-5 position-relative">
        <div className="scan-line-v"></div>
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="badge border border-sentinel-indigo text-sentinel-indigo mono px-3 py-1 smaller rounded-pill">
                    v1.0.0 ACTIVE
                  </div>
                </div>
                <h1 className="display-2 fw-bold tracking-tighter mb-4 text-glow">
                  PROJECT <span style={{ color: 'var(--sentinel-indigo)' }}>SENTINEL</span>
                </h1>
                <p className="lead mono text-dim mb-5 pe-lg-5">
                  Supervised Financial Intelligence harnessing high-dimensional PCA vectors to identify and neutralize fraudulent signatures in real-time.
                </p>
                <div className="d-flex gap-3">
                  <Button
                    className="btn-sentinel px-4 py-2 d-flex align-items-center gap-2"
                    onClick={onLaunch}
                  >
                    LAUNCH COMMAND CENTER <ChevronRight size={18} />
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="position-relative text-center"
              >
                <div className="p-5 glass-panel animate-pulse shadow-2xl position-relative z-index-2" style={{ borderColor: 'var(--sentinel-indigo)', minHeight: '400px' }}>
                  <Logo size={280} className="position-absolute top-50 start-50 translate-middle opacity-10" />
                  <div className="position-relative z-index-3">
                    <Logo size={80} className="mb-4" />
                    <h4 className="mono text-sentinel-indigo mb-4">CORE TELEMETRY</h4>
                    <div className="mb-3">
                      <div className="smaller mono text-dim mb-2 d-flex justify-content-between">
                        <span>THREAT VECTORS</span>
                        <span>ANALYZING...</span>
                      </div>
                      <div className="scanner-line mb-4"></div>
                    </div>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="mb-2 d-flex align-items-center gap-2">
                        <div className="p-1 glass-panel border-opacity-20">
                          <Activity size={12} className="text-sentinel-emerald" />
                        </div>
                        <div className="w-100 bg-white bg-opacity-5 rounded-pill" style={{ height: '4px' }}>
                          <motion.div
                            className="bg-sentinel-indigo h-100 rounded-pill"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.random() * 80 + 20}%` }}
                            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", delay: i * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-sentinel-indigo opacity-10 blur-3xl z-index-1"></div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* The Intelligence Section */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-5 fw-bold mb-4 mono uppercase tracking-tight">The Pillars of Analysis</h2>
            <div className="h-divider mx-auto mb-4" style={{ width: '80px', height: '3px', background: 'var(--sentinel-indigo)' }}></div>
            <p className="text-dim mono lead">
              How does Sentinel evaluate a 30-dimension transaction pulse?
            </p>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          <Col md={6} lg={4}>
            <FeatureCard
              icon={Lock}
              title="The PCA Shield"
              description="Features V1 to V28 use Principal Component Analysis (PCA) to protect user identity. We analyze mathematical 'shadows' of behavior, allowing us to spot fraud patterns without ever seeing sensitive personal data."
              delay={0.1}
            />
          </Col>
          <Col md={6} lg={4}>
            <FeatureCard
              icon={Target}
              title="30-Dimension Geometry"
              description="Every transaction is a single coordinate in a 30-dimensional workspace. Sentinel analyzes the distance between this coordinate and known 'Legitimate Clusters' using XGBoost and Random Forest logic."
              delay={0.2}
            />
          </Col>
          <Col md={6} lg={4}>
            <FeatureCard
              icon={Cpu}
              title="Multi-Brain Phalanx"
              description="We cross-verify threats across three distinct ML architectures. If the Gradient Boosting engine detects an anomaly, the Random Forest and Logistic engines are engaged to calculate ultimate confidence."
              delay={0.3}
            />
          </Col>
        </Row>

        <section className="explanation-detailed py-5 mt-5 glass-panel p-5 border-opacity-10 shadow-2xl">
          <Row className="gy-5 align-items-center">
            <Col lg={6}>
              <h3 className="mono uppercase tracking-widest text-sentinel-indigo mb-4">Basis of Intelligence</h3>
              <p className="mb-4 text-dim leading-relaxed">
                Project Sentinel is powered by the <strong>Credit Card Fraud Detection engine</strong>. Unlike traditional software that uses fixed rules (e.g., "if amount {'>'} $5000, block"), Sentinel uses <strong>High-Resolution Pattern Recognition</strong>.
              </p>
              <ul className="list-unstyled d-flex flex-column gap-3 mono smaller text-white">
                <li className="d-flex align-items-start gap-3">
                  <div className="mt-1 p-1 rounded-circle bg-sentinel-indigo shadow-sm"><ChevronRight size={12} /></div>
                  <div><strong>Dimensional Reduction:</strong> V1-V28 are transformed features capturing the essence of merchant geography and behavioral entropy.</div>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <div className="mt-1 p-1 rounded-circle bg-sentinel-indigo shadow-sm"><ChevronRight size={12} /></div>
                  <div><strong>Supervised Training:</strong> The engine is trained on 284,807 transactions, learning the exact 'fingerprint' of fraudulent activity.</div>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <div className="mt-1 p-1 rounded-circle bg-sentinel-indigo shadow-sm"><ChevronRight size={12} /></div>
                  <div><strong>Confidence Thresholds:</strong> Real-time probability scoring allows administrators to set investigative triggers at exact sensitivity levels.</div>
                </li>
              </ul>
            </Col>
            <Col lg={6}>
              <div className="p-4 glass-panel bg-black bg-opacity-30 border-opacity-20 d-flex flex-column gap-3 shadow-lg">
                <div className="d-flex justify-content-between align-items-center mono smaller">
                  <span className="text-dim">ANOMALY WEIGHTING</span>
                  <span className="text-sentinel-indigo">V-FEATURE PULSE</span>
                </div>
                {[0.8, 0.4, 0.9, 0.1, 0.6].map((w, i) => (
                  <div key={i} className="w-100 bg-white bg-opacity-5 rounded-1 overflow-hidden" style={{ height: '30px' }}>
                    <motion.div
                      className="h-100 bg-gradient-indigo"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${w * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      style={{
                        background: `linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.8) 100%)`,
                        borderRight: '2px solid var(--sentinel-indigo)'
                      }}
                    />
                  </div>
                ))}
                <p className="smaller mono text-dim text-center mt-2 m-0 italic">High-dimensional signature visualization</p>
              </div>
            </Col>
          </Row>
        </section>

        <div className="text-center mt-5 pt-5">
          <Button
            className="btn-sentinel px-5 py-3 d-flex align-items-center gap-3 mx-auto shadow-2xl"
            style={{ fontSize: '1.2rem' }}
            onClick={onLaunch}
          >
            ENTER THE COMMAND CENTER <Zap size={20} />
          </Button>
          <p className="mt-4 smaller mono text-dim uppercase tracking-widest">Authorized Access Only • Project Sentinel v1.0</p>
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;
