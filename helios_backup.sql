--
-- PostgreSQL database dump
--

\restrict njkbhXoy8UGkkaSor029cATYLg1pUiSLCv3EEItPBsdKBa9Rpm8XR6NEfaOCpyr

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    message text NOT NULL,
    severity text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- Name: decisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.decisions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    fx_pair text NOT NULL,
    amount numeric NOT NULL,
    time_horizon_days integer NOT NULL,
    signal_snapshot_id uuid,
    result jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.decisions OWNER TO postgres;

--
-- Name: fx_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fx_rates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    currency_pair text NOT NULL,
    rate numeric NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.fx_rates OWNER TO postgres;

--
-- Name: signals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fx_pair text NOT NULL,
    risk_score double precision NOT NULL,
    volatility_level text NOT NULL,
    confidence double precision NOT NULL,
    summary text,
    generated_at timestamp without time zone DEFAULT now(),
    raw_data jsonb
);


ALTER TABLE public.signals OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    company_name text,
    country text,
    created_at timestamp without time zone DEFAULT now(),
    password_reset_token text,
    password_reset_expires timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (id, user_id, message, severity, is_read, created_at) FROM stdin;
cd11511a-477f-4dcd-9a7f-7c4272d68933	0ffd49b4-669d-433b-ab29-1fcbd241d776	High risk detected for NGN/USD. Consider waiting before transacting.	high	t	2026-04-20 14:59:57.853748
ae6ea819-7dc2-4002-b20e-12643204cf0a	0ffd49b4-669d-433b-ab29-1fcbd241d776	High risk detected for NGN/USD. Consider waiting before transacting.	high	f	2026-04-27 19:47:08.016759
795a8c3d-b421-44d7-8a73-211d0674264c	0ffd49b4-669d-433b-ab29-1fcbd241d776	High risk detected for NGN/USD. Consider waiting before transacting.	high	f	2026-04-27 19:50:21.142204
734ddf12-8f16-4c97-a7ae-811fef1d671c	0ffd49b4-669d-433b-ab29-1fcbd241d776	High risk detected for NGN/USD. Consider waiting before transacting.	high	f	2026-04-27 19:51:01.828621
\.


--
-- Data for Name: decisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.decisions (id, user_id, fx_pair, amount, time_horizon_days, signal_snapshot_id, result, created_at) FROM stdin;
d34069f1-55df-443d-9e14-e08c0d439216	0ffd49b4-669d-433b-ab29-1fcbd241d776	NGN/USD	10000	5	7ae31b61-a781-4a54-b20c-72513499ea4d	{"fx_pair": "NGN/USD", "summary": "High volatility pressure detected", "decision": "WAIT", "confidence": 0.81, "risk_score": 0.73}	2026-04-20 14:59:57.831617
03180265-3e5f-4d69-a0cb-86ad4925d35f	0ffd49b4-669d-433b-ab29-1fcbd241d776	NGN/USD	10000	5	5821ac5f-6e2b-4674-995a-39cc89097212	{"news": [], "fx_pair": "NGN/USD", "summary": "High volatility pressure detected", "decision": "WAIT", "confidence": 0.81, "market_state": {"usd_flow": null, "liquidity_level": null, "volatility_level": "HIGH", "estimated_devaluation": null}, "engine_health": null, "model_outputs": {"lstm_sequence": [], "polymarket_sentiment": null}, "fx_other_pairs": {}, "signal_sources": {"spread": null, "official": null, "parallel": null}}	2026-04-27 19:47:08.006377
cabe5da1-40a2-45b4-a353-ca41a97d00a2	0ffd49b4-669d-433b-ab29-1fcbd241d776	NGN/USD	10000	5	5821ac5f-6e2b-4674-995a-39cc89097212	{"news": [{"url": "https://businessday.ng", "impact": "HIGH", "source": "BusinessDay", "summary": "Central bank announces new restrictions on dollar purchases", "headline": "CBN tightens FX controls"}, {"url": "https://reuters.com", "impact": "HIGH", "source": "Reuters", "summary": "Brent crude falls amid global demand concerns affecting Nigeria export revenue", "headline": "Oil prices drop 3%"}, {"url": "https://nairametrics.com", "impact": "MEDIUM", "source": "Nairametrics", "summary": "Diaspora remittances remain stable providing some FX support", "headline": "Remittance inflows steady"}], "fx_pair": "NGN/USD", "summary": "High volatility pressure detected", "decision": "WAIT", "confidence": 0.81, "market_state": {"usd_flow": "OUTFLOW", "liquidity_level": "LOW", "volatility_level": "HIGH", "estimated_devaluation": 2.3}, "engine_health": "GOOD", "model_outputs": {"lstm_sequence": [0.72, 0.74, 0.73, 0.75, 0.73], "polymarket_sentiment": 0.62}, "fx_other_pairs": {"AUDNGN": 1050, "EURNGN": 1720, "GBPNGN": 2040}, "signal_sources": {"spread": 40, "official": 1580, "parallel": 1620}}	2026-04-27 19:50:21.139238
cf53dd62-486d-4be9-9f0f-6312371f22e8	0ffd49b4-669d-433b-ab29-1fcbd241d776	NGN/USD	10000	5	5821ac5f-6e2b-4674-995a-39cc89097212	{"news": [{"url": "https://businessday.ng", "impact": "HIGH", "source": "BusinessDay", "summary": "Central bank announces new restrictions on dollar purchases", "headline": "CBN tightens FX controls"}, {"url": "https://reuters.com", "impact": "HIGH", "source": "Reuters", "summary": "Brent crude falls amid global demand concerns affecting Nigeria export revenue", "headline": "Oil prices drop 3%"}, {"url": "https://nairametrics.com", "impact": "MEDIUM", "source": "Nairametrics", "summary": "Diaspora remittances remain stable providing some FX support", "headline": "Remittance inflows steady"}], "fx_pair": "NGN/USD", "summary": "High volatility pressure detected", "decision": "WAIT", "confidence": 0.81, "market_state": {"usd_flow": "OUTFLOW", "liquidity_level": "LOW", "volatility_level": "HIGH", "estimated_devaluation": 2.3}, "engine_health": "GOOD", "model_outputs": {"lstm_sequence": [0.72, 0.74, 0.73, 0.75, 0.73], "polymarket_sentiment": 0.62}, "fx_other_pairs": {"AUDNGN": 1050, "EURNGN": 1720, "GBPNGN": 2040}, "signal_sources": {"spread": 40, "official": 1580, "parallel": 1620}}	2026-04-27 19:51:01.824467
\.


--
-- Data for Name: fx_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fx_rates (id, currency_pair, rate, "timestamp") FROM stdin;
\.


--
-- Data for Name: signals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.signals (id, fx_pair, risk_score, volatility_level, confidence, summary, generated_at, raw_data) FROM stdin;
7ae31b61-a781-4a54-b20c-72513499ea4d	NGN/USD	0.73	HIGH	0.81	High volatility pressure detected	2026-04-15 18:57:54.596734	\N
5821ac5f-6e2b-4674-995a-39cc89097212	NGN/USD	0.73	HIGH	0.81	High volatility pressure detected	2026-04-27 19:44:01.67252	{"x": {"spread": 40.0, "official": 1580.0, "parallel": 1620.0}, "news": [{"url": "https://businessday.ng", "impact": "HIGH", "source": "BusinessDay", "summary": "Central bank announces new restrictions on dollar purchases", "headline": "CBN tightens FX controls"}, {"url": "https://reuters.com", "impact": "HIGH", "source": "Reuters", "summary": "Brent crude falls amid global demand concerns affecting Nigeria export revenue", "headline": "Oil prices drop 3%"}, {"url": "https://nairametrics.com", "impact": "MEDIUM", "source": "Nairametrics", "summary": "Diaspora remittances remain stable providing some FX support", "headline": "Remittance inflows steady"}], "decision": "WAIT", "usd_flow": "OUTFLOW", "confidence": 0.81, "engine_health": "GOOD", "lstm_sequence": [0.72, 0.74, 0.73, 0.75, 0.73], "fx_other_pairs": {"AUDNGN": 1050.0, "EURNGN": 1720.0, "GBPNGN": 2040.0}, "liquidity_level": "LOW", "volatility_level": "HIGH", "polymarket_sentiment": 0.62, "estimated_devaluation": 2.3}
1466509f-3dab-4fe0-b81d-33a34555bb7e	NGN/USD	0.050000000000000044	LOW	0.95	WAIT signal detected. Volatility: LOW, USD Flow: NEUTRAL	2026-05-02 17:22:03.211532	{"x": {"spread": 29.01962299999991, "official": 1375.980377, "parallel": 1405}, "news": [{"url": "https://www.lawyersgunsmoneyblog.com/2026/05/remember-when-biden-put-a-three-dollar-per-gallon-surcharge-on-gas-to-pay-for-transition-surgery-for-trans-volleyball-players", "impact": "neutral", "source": "Lawyersgunsmoneyblog.com", "headline": "Remember when Biden put a three-dollar per gallon surcharge on gas to pay for transition surgery for trans volleyball players?", "description": "Those were the days my friend: Meanwhile in right-wing fantasyland: MAGA is trying to deal with its affordability crisis simply by denying reality. Over the past few days multiple prominent Republicans have gone on TV to insist that gas prices are falling. On…"}], "decision": "WAIT", "usd_flow": "NEUTRAL", "confidence": 0.95, "fx_other_pairs": {"AUDNGN": 990.7057921835367, "EURNGN": 1613.39083895175, "GBPNGN": 1868.3074020516374}, "liquidity_level": "HIGH", "volatility_level": "LOW", "polymarket_sentiment": 0.3017500221281671, "estimated_devaluation": 0.40629298832626165}
f39fab27-9f5d-4043-a24c-deba5e6bcfb6	NGN/USD	0.050000000000000044	LOW	0.95	WAIT signal detected. Volatility: LOW, USD Flow: NEUTRAL	2026-05-02 18:02:03.286666	{"x": {"spread": 29.01962299999991, "official": 1375.980377, "parallel": 1405}, "news": [{"url": "https://cryptobriefing.com/manufacturing-ism-report-shows-price-surge-employment-drop-amid-fed-rate-cut/", "impact": "negative", "source": "Crypto Briefing", "headline": "Manufacturing ISM report shows price surge, employment drop amid Fed rate cut talk", "description": "Economic pressures from price surges and employment drops may prompt the Fed to consider rate cuts, impacting future monetary policy.\\nThe post Manufacturing ISM report shows price surge, employment drop amid Fed rate cut talk appeared first on Crypto Briefing."}], "decision": "WAIT", "usd_flow": "NEUTRAL", "confidence": 0.95, "fx_other_pairs": {"AUDNGN": 990.7057921835367, "EURNGN": 1613.39083895175, "GBPNGN": 1868.3074020516374}, "liquidity_level": "HIGH", "volatility_level": "LOW", "polymarket_sentiment": 0.3019923119177958, "estimated_devaluation": 0.40629298832626165}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, company_name, country, created_at, password_reset_token, password_reset_expires) FROM stdin;
fa0267f8-ef63-4eaa-b884-34ea8f0af45c	test@helios.com	$2b$12$3OlnL1uc831KsKP5NFkBu.NkNQRX2a0Bi783dDix4DQtbm3xNDqCW	Helios Test	Nigeria	2026-04-15 09:42:11.379402	\N	\N
5c4fa569-d434-4d47-be3d-c70d00747a94	test2@helios.com	$2b$12$uHhgp34p6lJ2ID6S1sggAew8bq12Ed09Vf/BOeKIpynbRpO5lKqtu	Helios Test	Nigeria	2026-04-15 20:38:45.114638	\N	\N
0ffd49b4-669d-433b-ab29-1fcbd241d776	precious@helios.com	$2b$12$xNerXUhDayR5DAmxC9XfU.cCp4mKjZS7I3MLhYc0fgYfOPueWU.3C	Helios Test	Nigeria	2026-04-20 12:35:12.319785	\N	\N
cb6e99d6-291a-410e-af2b-1d635539bee4	precious@example.com	$2b$12$SzG8rUPgXzFjRXKY6n513uNZ9kXyElvaOv54ZJkXm71ZRQfB/8xVK	Precious	Nigeria	2026-05-02 17:34:47.043692	\N	\N
\.


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: decisions decisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decisions
    ADD CONSTRAINT decisions_pkey PRIMARY KEY (id);


--
-- Name: fx_rates fx_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fx_rates
    ADD CONSTRAINT fx_rates_pkey PRIMARY KEY (id);


--
-- Name: signals signals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signals
    ADD CONSTRAINT signals_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: alerts alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: decisions decisions_signal_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decisions
    ADD CONSTRAINT decisions_signal_snapshot_id_fkey FOREIGN KEY (signal_snapshot_id) REFERENCES public.signals(id);


--
-- Name: decisions decisions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.decisions
    ADD CONSTRAINT decisions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict njkbhXoy8UGkkaSor029cATYLg1pUiSLCv3EEItPBsdKBa9Rpm8XR6NEfaOCpyr

