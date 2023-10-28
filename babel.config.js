module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: false }],
    ["@babel/plugin-proposal-private-methods", { loose: false }]
  ],
  assumptions: {
    setPublicClassFields: false
  }
}
