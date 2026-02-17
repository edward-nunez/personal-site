interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo = ({ className }: AnimatedLogoProps) => {
  return (
    <svg
      className={className}
      viewBox="-2 -2 121 103"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
    >
      {/* CSS for trace animation */}
      <style>{`
        @keyframes convey-right {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -28; }
        }
        @keyframes convey-left {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 28; }
        }
        .convey-flow-right {
          stroke-dasharray: 8 6;
          animation: convey-right 1s linear infinite;
        }
        .convey-flow-left {
          stroke-dasharray: 8 6;
          animation: convey-left 1s linear infinite;
        }
      `}</style>

      {/* Animated trace overlay - left lobe outer curve (flows rightward) */}
      <g transform="matrix(1,0,0,1,64.3375,24.6516)">
        <path
          className="convey-flow-right"
          d="M-50.644,27.365C-61.328,19.514 -65.555,8.187 -62.515,-3.689C-59.74,-14.531 -50.67,-22.311 -38.606,-23.873C-31.66,-24.772 -24.752,-23.475 -19.696,-18.749C-12.692,-12.199 -6.609,-4.665 0,2.593"
          fill="none"
          stroke="hsl(5, 100%, 63%)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Animated trace overlay - right lobe outer curve (flows leftward) */}
      <g transform="matrix(1,0,0,1,103.666,-1.27757)">
        <path
          className="convey-flow-left"
          d="M-38.746,14.118C-31.308,4.975 -21.978,0 -9.8,2.414C1.576,4.67 8.955,11.649 11.744,22.885C14.88,35.524 9.883,45.342 0,53.489"
          fill="none"
          stroke="hsl(5, 100%, 63%)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Left arrow - static */}
      <g id="left-arrow" transform="matrix(1,0,0,1,53.8732,40.3462)">
        <path
          d="M0,36.207C-3.378,39.564 -5.744,41.915 -7.731,43.891C-16.557,35.065 -25.3,26.321 -33.657,17.964C-25.52,9.824 -16.708,1.01 -8.018,-7.684C-6.16,-5.886 -3.681,-3.484 -0.764,-0.66C-6.954,5.166 -13.299,11.14 -19.698,17.164C-12.836,23.798 -6.576,29.85 0,36.207"
          style={{ fill: 'white', fillRule: 'nonzero', stroke: 'black', strokeWidth: '1.5px' }}
        />
      </g>

      {/* Right arrow - static */}
      <g id="right-arrow" transform="matrix(1,0,0,1,83.8517,57.8943)">
        <path
          d="M0,0.904C-7.426,-6.227 -13.716,-12.266 -20.061,-18.359C-17.131,-21.088 -14.598,-23.448 -12.342,-25.549C-3.749,-16.952 4.987,-8.214 13.356,0.157C4.991,8.546 -3.727,17.288 -12.866,26.453C-14.478,24.438 -16.62,21.761 -18.75,19.099C-13.205,13.718 -6.971,7.669 0,0.904"
          style={{ fill: 'white', fillRule: 'nonzero', stroke: 'black', strokeWidth: '1.5px' }}
        />
      </g>

      {/* Bottom chevron - static */}
      <g
        id="bottom"
        transform="matrix(1,0,0,1,58.4581,88.3699)"
        fill="currentColor"
        stroke="currentColor"
      >
        <path
          d="M0,8.444L-8.752,3.672L-8.995,0.421L-0.486,5.3L8.267,0L8.509,3.251L0,8.444Z"
          style={{
            fillRule: 'nonzero',
            strokeWidth: '2px',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 4,
          }}
        />
      </g>
    </svg>
  );
};

export default AnimatedLogo;
