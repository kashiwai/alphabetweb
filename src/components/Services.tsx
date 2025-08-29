'use client'

import { useState, useEffect } from 'react'

export default function Services() {
  const [consultingCount, setConsultingCount] = useState(127)

  useEffect(() => {
    // 初期値をランダムに設定
    setConsultingCount(Math.floor(Math.random() * 50) + 100)
    
    // 2分ごとに数値を更新
    const interval = setInterval(() => {
      setConsultingCount(prevCount => {
        // -10から+15の範囲でランダムに変動
        const change = Math.floor(Math.random() * 26) - 10
        const newCount = prevCount + change
        // 80〜200の範囲に収める
        return Math.max(80, Math.min(200, newCount))
      })
    }, 120000) // 2分 = 120000ミリ秒

    return () => clearInterval(interval)
  }, [])
  const services = [
    {
      title: "AIオーケストレーション開発",
      description: "複数のAIモデルを統合し、ビジネスニーズに合わせた最適なAIシステムを構築。GPT、Claude、Geminiなど最新のLLMを活用した革新的なソリューション。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      features: ["マルチAI統合", "API最適化", "リアルタイム処理", "スケーラブル設計"],
      gradient: "from-purple-400 to-indigo-600"
    },
    {
      title: "AI戦略コンサルティング",
      description: "貴社のビジネス課題を分析し、AIを活用した最適な解決策を提案。ROIを最大化する戦略立案から実装までトータルサポート。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      features: ["ビジネス分析", "POC開発", "投資対効果算出", "実装ロードマップ"],
      gradient: "from-blue-400 to-cyan-600"
    },
    {
      title: "カスタムAI開発",
      description: "お客様の独自要件に合わせたAIモデルの開発。自然言語処理、画像認識、予測分析など、様々な分野に対応。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: ["機械学習モデル", "ファインチューニング", "エッジAI実装", "MLOps構築"],
      gradient: "from-teal-400 to-green-600"
    },
    {
      title: "プロセス自動化",
      description: "RPA×AIで業務プロセスを自動化。定型業務から意思決定支援まで、幅広い業務効率化を実現。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      features: ["業務自動化", "インテリジェントRPA", "ワークフロー最適化", "24/7稼働"],
      gradient: "from-orange-400 to-red-600"
    },
    {
      title: "データ分析・可視化",
      description: "ビッグデータをAIで分析し、ビジネスインサイトを抽出。直感的なダッシュボードで意思決定を支援。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: ["予測分析", "リアルタイムBI", "異常検知", "レポート自動生成"],
      gradient: "from-pink-400 to-purple-600"
    },
    {
      title: "AIセキュリティ・ガバナンス",
      description: "AI導入における倫理的配慮、セキュリティ対策、コンプライアンス対応をトータルサポート。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      features: ["AI倫理ガイドライン", "プライバシー保護", "監査対応", "リスク管理"],
      gradient: "from-gray-600 to-gray-900"
    }
  ]

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-2">
            AIテクノロジーで
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ビジネスを革新
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            最先端のAI技術と豊富な実装経験を活かし、お客様のビジネス課題を解決する最適なソリューションを提供します
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                {service.description}
              </p>
              
              <ul className="space-y-3 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full bg-gradient-to-r ${service.gradient} text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105`}>
                詳細を見る
              </button>
            </div>
          ))}
        </div>

        {/* Cost Reduction Examples */}
        <div className="mt-20 mb-12">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-2">
              圧倒的なコスト削減を実現
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              最新のAI技術とクラウドサービスを活用し、従来の開発コストを大幅に削減
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* AI電話受電サービス事例 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">AI電話受電サービス</h4>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-gray-500 line-through text-2xl mr-3">4,000〜5,000万円</span>
                  <span className="text-3xl font-bold text-blue-600">→ 1,000万円以内</span>
                </div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-semibold">
                  最大80%コスト削減
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                最新のAI音声認識・自然言語処理技術を活用し、24時間365日対応可能な電話受電システムを低コストで実現。
              </p>
              
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>クラウドベースで初期投資を最小化</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>既存のAI APIを活用し開発期間を短縮</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>段階的な機能追加で初期コストを抑制</span>
                </li>
              </ul>
            </div>

            {/* チャットボット開発事例 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">AIチャットボット</h4>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-gray-500 line-through text-2xl mr-3">2,000〜3,000万円</span>
                  <span className="text-3xl font-bold text-purple-600">→ 500万円以内</span>
                </div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-semibold">
                  最大75%コスト削減
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                GPT-4やClaude APIを活用し、高度な対話能力を持つカスタマーサポートボットを短期間・低コストで構築。
              </p>
              
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>事前学習済みモデルで学習コスト削減</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ノーコードツールで設定変更が簡単</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>従量課金制で運用コストも最適化</span>
                </li>
              </ul>
            </div>

            {/* データ分析プラットフォーム事例 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">AI分析プラットフォーム</h4>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-gray-500 line-through text-2xl mr-3">3,000〜4,000万円</span>
                  <span className="text-3xl font-bold text-teal-600">→ 800万円以内</span>
                </div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-semibold">
                  最大73%コスト削減
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                既存のBIツールとAIを組み合わせ、予測分析や異常検知機能を持つ高度な分析システムを構築。
              </p>
              
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>オープンソースツールを最大限活用</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>クラウドネイティブで拡張性を確保</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AutoMLで開発工数を大幅削減</span>
                </li>
              </ul>
            </div>

            {/* 画像認識システム事例 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">AI画像認識システム</h4>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-gray-500 line-through text-2xl mr-3">2,500〜3,500万円</span>
                  <span className="text-3xl font-bold text-orange-600">→ 600万円以内</span>
                </div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block text-sm font-semibold">
                  最大76%コスト削減
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                製造業の品質検査や小売業の在庫管理など、用途に特化した画像認識システムを低コストで実現。
              </p>
              
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>転移学習で少ないデータでも高精度</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>エッジデバイスで処理し通信コスト削減</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>段階的導入でリスクを最小化</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            なぜ、ここまでコスト削減が可能なのか？
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🚀</div>
              <h4 className="font-semibold mb-1">最新技術の活用</h4>
              <p className="text-sm opacity-90">GPT-4、Claude等の最新AIを活用し開発期間を短縮</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">☁️</div>
              <h4 className="font-semibold mb-1">クラウドネイティブ</h4>
              <p className="text-sm opacity-90">初期投資を抑え、必要に応じてスケール可能</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🔧</div>
              <h4 className="font-semibold mb-1">アジャイル開発</h4>
              <p className="text-sm opacity-90">MVPから始め、段階的に機能を追加</p>
            </div>
          </div>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            無料でコスト削減診断を受ける
          </button>
        </div>

        {/* AI Avatar Consultation Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-purple-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
                  <span className="flex w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
                  NEW! AIアバター無料相談
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  24時間365日、AIアバターが
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    無料でご相談に対応します
                  </span>
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  最新のAI技術を活用したバーチャルコンサルタントが、貴社のビジネス課題を詳しくヒアリング。
                  最適なAIソリューションのご提案から概算見積もりまで、即座にご対応いたします。
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900 mb-1">待ち時間ゼロ</h4>
                      <p className="text-gray-600 text-sm">深夜・休日問わず、いつでも即座に相談開始</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900 mb-1">専門知識を即座に提供</h4>
                      <p className="text-gray-600 text-sm">最新のAI技術トレンドや導入事例を基にアドバイス</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900 mb-1">概算見積もりを即時算出</h4>
                      <p className="text-gray-600 text-sm">ご要望を分析し、その場で概算費用をご提示</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900 mb-1">完全無料・登録不要</h4>
                      <p className="text-gray-600 text-sm">面倒な登録なしで、すぐに相談を開始できます</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    AIアバターと相談を始める
                  </button>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                  >
                    人間のコンサルタントに相談
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900">AI コンサルタント</h4>
                        <p className="text-sm text-green-600">● オンライン</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2">よくあるご相談内容：</p>
                      <div className="space-y-2">
                        <div className="bg-white rounded px-3 py-2 text-sm text-gray-700">
                          「AIを導入したいが、何から始めれば？」
                        </div>
                        <div className="bg-white rounded px-3 py-2 text-sm text-gray-700">
                          「既存システムにAIを組み込む費用は？」
                        </div>
                        <div className="bg-white rounded px-3 py-2 text-sm text-gray-700">
                          「ROIはどれくらいで回収できる？」
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-purple-200 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-indigo-200 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-blue-200 rounded-full border-2 border-white"></div>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        本日<span className="font-bold text-purple-600">{consultingCount}名</span>が相談中
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}