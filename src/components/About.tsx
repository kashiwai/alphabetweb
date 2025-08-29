'use client'

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-2">
            AIの力で未来を創造する
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            私たちは、最先端のAI技術とビジネス戦略を融合させ、
            企業のデジタルトランスフォーメーションを加速させるパートナーです
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              ミッション
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              株式会社ALPHABETは、AI技術の民主化を目指し、あらゆる規模の企業が最先端のAIソリューションを活用できる環境を創造します。複雑なAI技術をシンプルで使いやすいソリューションに変換し、ビジネスの成長と革新を支援します。
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              私たちは単なる技術提供者ではなく、お客様のビジネスパートナーとして、戦略立案から実装、運用まで一貫したサポートを提供し、持続可能な成長を実現します。
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                <div className="text-4xl font-bold text-indigo-600 mb-2">200+</div>
                <div className="text-gray-600">導入プロジェクト</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">エンタープライズ顧客</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
                <div className="text-4xl font-bold text-teal-600 mb-2">99.9%</div>
                <div className="text-gray-600">システム稼働率</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">サポート体制</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              私たちの強み
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">最先端技術</h4>
                  <p className="text-gray-600">
                    GPT-4、Claude、Geminiなど最新のAIモデルを組み合わせ、最適なソリューションを構築
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">豊富な実績</h4>
                  <p className="text-gray-600">
                    金融、製造、小売、ヘルスケアなど、多様な業界での成功事例と深い知見
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">専門チーム</h4>
                  <p className="text-gray-600">
                    AI研究者、データサイエンティスト、ビジネスコンサルタントによる総合的なサポート
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">セキュリティ重視</h4>
                  <p className="text-gray-600">
                    エンタープライズグレードのセキュリティと、厳格なデータガバナンスを実現
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            AIの可能性を、共に探求しませんか？
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            貴社のビジネス課題をお聞かせください。最適なAIソリューションをご提案いたします
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            無料相談を申し込む
          </button>
        </div>
      </div>
    </section>
  )
}