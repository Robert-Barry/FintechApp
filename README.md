# Fintech App - Mobile App Micro-Savings Wallet (Proof of Concept)

An enterprise-grade, localized fintech mobile application built with **React Native (Expo)** and **TypeScript**. This application includes defensive financial parsing structures, automated calculation pipelines, and a colocated testing framework using **Jest** and **React Native Testing Library (RNTL)**.

> **Project Status: Active Development** > This workspace is actively being developed using Test-Driven Development (TDD) methodologies. Core business logic, UI integration layers, and decoupled data type architectures are fully implemented and backed by rigorous automated testing.


## Key Engineering Focus Areas

* **Defensive Financial Invariants:** Avoids floating-point math issues completely by handling all monetary aggregates using absolute integer minor-units (cents).
* **Modular Domain Architecture:** Highly organized feature-driven directory layout (`features/wallet/`) separating types, UI display layout items, and underlying core calculation layers.
* **Rigorous Testing Discipline:** Deep integration tests simulating physical render loops and user-experience paths rather than testing brittle framework states.
* **Optimized Rendering Pipelines:** Implements virtualized, lazy-loaded rendering blocks via `FlatList` to optimize rendering pipelines and maximize performance across low-end mobile hardware.
