export default function generateSKU({ type, name, size, seq }) {
  return `${type}-${name}-${size}-${seq}`.toUpperCase().replace(/\s+/g, "-");
}
