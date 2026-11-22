// Inline (non-React) script for the loading screen: a ray-traced Schwarzschild
// black hole in WebGL. It runs as soon as the HTML is parsed, so the scene
// starts before the app's JavaScript loads. If WebGL is missing or fails to
// compile, it does nothing and the CSS version of the scene stays visible.
//
// Physics: each pixel's light ray is integrated backwards from the camera with
// the standard Schwarzschild photon approximation  a = -1.5 h^2 r / |r|^5
// (units of the Schwarzschild radius). Crossings of the disk plane are shaded
// (Keplerian rotation, temperature falloff, Doppler beaming), rays that fall in
// are black, and rays that escape sample a procedural starfield, so lensing of
// the disk's far side, the photon ring and warped stars all emerge naturally.
// A second pass adds bloom, tone mapping, vignette and grain.

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const SCENE = String.raw`
precision highp float;
uniform vec2 uRes;
uniform float uTime, uDist, uYaw, uPix, uAsp, uFoc, uLift;
uniform sampler2D uNoise;

float h21(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}
float h31(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
// noise from a small random texture (cheap to compile and run). x scales are integers so
// a full turn around the disk wraps the texture exactly: no seam.
float fbmT(vec2 p){
  return .5*texture2D(uNoise,p).r+.25*texture2D(uNoise,p*2.+vec2(.13,.71)).r
        +.125*texture2D(uNoise,p*4.+vec2(.29,.37)).r+.0625*texture2D(uNoise,p*8.+vec2(.51,.19)).r;
}

const float PI=3.14159265, TAU=6.2831853;
const float RIN=2.9, ROUT=11.5;

vec3 disk(vec3 q,vec3 dir,out float alpha){
  float r=length(q.xz);
  float phi=atan(q.z,q.x);
  float omega=1.9/pow(r,1.5);
  float ph=mod(phi-uTime*omega*1.6+PI,TAU)-PI;
  float u=ph/TAU+.5;
  float big=fbmT(vec2(u*3.,r*.085))*1.07;
  float fil=fbmT(vec2(u*14.,r*.42+.31))*1.07;
  float bands=.5+.5*sin(r*5.0+big*9.0+fil*3.0);
  float edgeIn=smoothstep(RIN,RIN+.45,r);
  float edgeOut=1.-smoothstep(ROUT*.38,ROUT,r);
  // emissivity peaks just outside the inner edge (r^-3 (1 - sqrt(3/r)) shape)
  float em=pow(RIN/r,2.2)*(1.-.55*sqrt(RIN/r))*2.6;
  float dens=edgeIn*edgeOut*(.45+.55*big)*(.62+.38*fil)*(.88+.12*bands);
  float temp=pow(RIN/r,.75);
  // Doppler: gas orbits counter-clockwise; light reaching us travels along -dir
  vec3 vel=normalize(vec3(-q.z,0.,q.x));
  float beta=clamp(sqrt(.5/max(r-1.,.6)),0.,.62);
  float c=dot(vel,-dir);
  float g=sqrt(1.-beta*beta)/(1.-beta*c);
  float boost=mix(1.,pow(g,3.),.55);
  float k=clamp(temp*mix(1.,g,.6),0.,1.3);
  vec3 deep=vec3(.20,.04,.42), vio=vec3(.62,.30,1.), lav=vec3(.84,.66,1.), hot=vec3(1.,.96,1.);
  vec3 col=mix(deep,vio,smoothstep(.06,.32,k));
  col=mix(col,lav,smoothstep(.32,.66,k));
  col=mix(col,hot,smoothstep(.66,1.02,k));
  alpha=clamp(dens*1.5,0.,.93);
  return col*dens*em*4.5*boost;
}

// stars on the six faces of a cube around the camera: round, evenly spread
vec3 starLayer(vec3 d,float N,float keep,float seed){
  vec3 a=abs(d); vec2 uv; float face;
  if(a.x>=a.y&&a.x>=a.z){uv=d.yz/a.x;face=d.x>0.?0.:1.;}
  else if(a.y>=a.z){uv=d.xz/a.y;face=d.y>0.?2.:3.;}
  else{uv=d.xy/a.z;face=d.z>0.?4.:5.;}
  vec2 g=(uv*.5+.5)*N, id=floor(g), f=fract(g);
  vec3 key=vec3(id,face*31.+seed);
  if(h31(key)>keep) return vec3(0.);
  vec2 sp=vec2(h31(key+1.3),h31(key+7.1))*.7+.15;
  float dd=length(f-sp);
  float sig=max(.3*uPix*N,.018);
  float m=h31(key+9.2);
  float b=pow(m,8.)*9.+.22;
  float core=exp(-dd*dd/(2.*sig*sig));
  float halo=exp(-dd*dd/(2.*sig*sig*12.))*.04*b;
  float t=h31(key+5.5);
  vec3 tint=t<.3?vec3(.74,.82,1.):(t<.8?vec3(1.,.98,.97):vec3(.9,.8,1.));
  return tint*(core*b+halo);
}
vec3 sky(vec3 d){
  vec3 col=starLayer(d,120.,.06,1.)+starLayer(d,260.,.035,2.)*.7+starLayer(d,560.,.018,3.)*.45;
  // faint galaxy band and nebula haze
  vec3 n=normalize(vec3(.25,1.,-.4));
  float band=exp(-pow(dot(d,n)*3.2,2.));
  float az=atan(d.z,d.x)/TAU+.5;
  float neb=fbmT(vec2(az*2.,d.y*.32+.4))*1.07;
  float neb2=fbmT(vec2(az*5.,d.y*.8+.15))*1.07;
  col+=band*(neb*neb)*vec3(.30,.16,.55)*.22;
  col+=band*smoothstep(.6,.9,neb2)*vec3(.55,.42,.9)*.1;
  col+=pow(neb2,3.)*vec3(.10,.07,.22)*.18;
  return col;
}

void main(){
  vec2 uv=(gl_FragCoord.xy/uRes-.5)*vec2(uAsp,1.);
  float elev=.085;
  vec3 ro=vec3(sin(uYaw)*cos(elev),sin(elev),-cos(uYaw)*cos(elev))*uDist;
  vec3 fw=normalize(-ro);
  vec3 rt=normalize(cross(vec3(0,1,0),fw));
  vec3 up=cross(fw,rt);
  float roll=.06;
  vec3 r2=rt*cos(roll)+up*sin(roll); up=up*cos(roll)-rt*sin(roll); rt=r2;
  vec3 v=normalize(fw*uFoc+uv.x*rt+(uv.y+uLift*uFoc)*up);
  vec3 p=ro; vec3 rd0=v; float rmin=1e3;
  vec3 hv=cross(p,v); float h2=dot(hv,hv);
  vec3 col=vec3(0.); float trans=1.; float glow=0.; float fell=0.; float out_=0.; float hits=0.;
  // disk hits are recorded in the loop and shaded afterwards (keeps the loop small,
  // which makes the shader compile fast on Direct3D/ANGLE and run faster)
  vec3 q0=vec3(0.),q1=vec3(0.),d0=vec3(0.),d1=vec3(0.);
  for(int i=0;i<STEPS;i++){
    float r=length(p);
    if(r<1.){fell=1.;break;}
    if(r>uDist+25. && dot(p,v)>0.){out_=1.;break;}
    rmin=min(rmin,r);
    // finer steps near the hole keep photon-sphere orbits accurate
    float dt=clamp(.07*(r-.75),.01,4.)*mix(.55,1.,smoothstep(3.,7.,r));
    vec3 acc=-1.5*h2*p/pow(r,5.);
    vec3 vn=v+acc*dt;
    vec3 pn=p+vn*dt;
    if(p.y*pn.y<0.){
      vec3 q=mix(p,pn,p.y/(p.y-pn.y));
      float rq=length(q.xz);
      if(rq>RIN && rq<ROUT && hits<2.){
        vec3 nd=normalize(vn);
        if(hits<.5){q0=q;d0=nd;} else {q1=q;d1=nd;}
        hits+=1.;
      }
    }
    p=pn; v=vn;
  }
  // Impact parameter decides the ray's fate exactly: below 3*sqrt(3)/2 it falls in.
  // A captured ray can only show the near side of the disk (the band crossing in front
  // of the shadow); anything else it 'hits' is integration error, so the shadow stays black.
  float b=sqrt(h2);
  float cap=1.-smoothstep(2.57,2.63,b);
  if(out_<.5) fell=1.;
  fell=max(fell,cap);
  vec2 cdir=normalize(ro.xz);
  float a, kf;
  if(hits>.5){vec3 dc=disk(q0,d0,a); kf=mix(1.,smoothstep(-.4,.4,dot(q0.xz,cdir)),cap); col+=trans*dc*a*kf; trans*=1.-a*kf;}
  if(hits>1.5){vec3 dc=disk(q1,d1,a); kf=1.-cap; col+=trans*dc*a*kf; trans*=1.-a*kf;}
  // escaping rays: keep integrating outward with growing steps so the leftover
  // bending is continuous (removes concentric banding in the starfield)
  if(out_>.5){
    for(int k=0;k<14;k++){
      float r=length(p);
      float dt=r*.6;
      v+=-1.5*h2*p/pow(r,5.)*dt;
      p+=v*dt;
    }
  }
  // full lensing near the hole (Einstein-ring arcs), eased off far away so distant stars stay crisp points
  vec3 sd=normalize(mix(normalize(v),rd0,smoothstep(4.5,11.,rmin)*.7));
  if(fell<.5) col+=trans*sky(sd);
  // photon ring: light that orbits the hole before escaping piles up just outside the
  // shadow edge (b = 2.598). Drawn analytically so it is a clean, unbroken hairline.
  float bw=max(uPix*uDist*1.1,.004);
  float side=smoothstep(2.585,2.61,b);
  col+=vec3(.86,.74,1.)*(exp(-pow((b-2.612)/bw,2.))*2.2+exp(-pow((b-2.66)/(bw*7.),2.))*.35)*side;
  gl_FragColor=vec4(min(col*.25,vec3(1.)),1.);
}`;

const POST = String.raw`
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes, uTS;
uniform float uExpo, uTime;
float h21(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
// one mip level, smoothed with four diagonal taps one texel of that level apart
vec3 lv(vec2 uv,float l){
  vec2 o=uTS*exp2(l)*.75;
  return (texture2D(uTex,uv+vec2(o.x,o.y),l).rgb+texture2D(uTex,uv+vec2(-o.x,o.y),l).rgb
         +texture2D(uTex,uv+vec2(o.x,-o.y),l).rgb+texture2D(uTex,uv-o,l).rgb);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec3 base=texture2D(uTex,uv).rgb*4.;
  // bloom: wide, soft, layered glow from progressively blurrier mip levels
  vec3 bloom=max(lv(uv,2.)-.55,0.)*.30+max(lv(uv,3.)-.45,0.)*.28
            +max(lv(uv,4.)-.35,0.)*.24+max(lv(uv,5.)-.25,0.)*.20+max(lv(uv,6.)-.2,0.)*.16;
  // anamorphic streak: horizontal taps on a blurred level, spaced one texel apart so they merge
  vec3 streak=vec3(0.);
  float sx=uTS.x*8.;
  for(int i=-9;i<=9;i++){
    float fi=float(i);
    vec3 s=texture2D(uTex,uv+vec2(fi*sx,0.),3.).rgb*4.;
    streak+=max(s-1.5,0.)*(1.-abs(fi)/10.);
  }
  vec3 col=base+bloom*1.15+streak*vec3(.55,.42,1.)*.035;
  col*=uExpo;
  col=aces(col*1.1);
  vec2 c=uv-.5;
  col*=1.-dot(c,c)*.9;
  col+=(h21(gl_FragCoord.xy+fract(uTime*7.)*91.)-.5)*.018;
  gl_FragColor=vec4(pow(max(col,0.),vec3(1./2.2)),1.);
}`;

const JS = String.raw`
(function(){
  var d=document.documentElement;
  if(d.dataset.intro==='seen') return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cv=document.getElementById('bh-gl'); if(!cv) return;
  var T0=performance.now();
  var gl=cv.getContext('webgl',{antialias:false,alpha:false,depth:false,stencil:false,powerPreference:'high-performance'});
  if(!gl) return;
  var small=Math.min(innerWidth,innerHeight)<700;
  var steps=small?190:240;
  var scale=small?0.8:0.62;
  var par=gl.getExtension('KHR_parallel_shader_compile');
  function mk(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  function link(fs){var v=mk(gl.VERTEX_SHADER,VERT_SRC),f=mk(gl.FRAGMENT_SHADER,fs);var p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.bindAttribLocation(p,0,'a');gl.linkProgram(p);return p;}
  var pS=null, pP=null;
  function ready(){return !par||(gl.getProgramParameter(pS,par.COMPLETION_STATUS_KHR)&&gl.getProgramParameter(pP,par.COMPLETION_STATUS_KHR));}
  // the CSS intro's clock (ms since its animations began); falls back to script time
  var panel=document.querySelector('.intro-panel');
  function cssT(){ try{ var a=panel.getAnimations(); if(a.length&&a[0].currentTime!=null) return +a[0].currentTime; }catch(e){} return performance.now()-T0; }
  function wait(){
    if(cssT()>1040) return; // too late: the CSS scene is about to dive, let it finish
    if(!ready()){requestAnimationFrame(wait);return;}
    if(!gl.getProgramParameter(pS,gl.LINK_STATUS)||!gl.getProgramParameter(pP,gl.LINK_STATUS)) return;
    start();
  }
  function start(){
    var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    var tex=gl.createTexture(), fbo=gl.createFramebuffer(), W=0,H=0,TW=0,TH=0;
    // 256x256 random noise texture on unit 1, mipmapped and repeating
    var nt=gl.createTexture(), nd=new Uint8Array(256*256*4), sd=1337;
    for(var i=0;i<nd.length;i++){ sd=(sd*16807)%2147483647; nd[i]=sd&255; }
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,nt);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,256,256,0,gl.RGBA,gl.UNSIGNED_BYTE,nd);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D); gl.activeTexture(gl.TEXTURE0);
    function size(){
      W=Math.max(2,Math.round(innerWidth*scale)); H=Math.max(2,Math.round(innerHeight*scale));
      cv.width=W; cv.height=H;
      // power-of-two scene target so the post pass can blur it with mipmaps
      TW=Math.pow(2,Math.round(Math.log(W)/Math.LN2)); TH=Math.pow(2,Math.round(Math.log(H)/Math.LN2));
      gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,TW,TH,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
    }
    size();
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE) return;
    var U=function(p,n){return gl.getUniformLocation(p,n);};
    var sRes=U(pS,'uRes'),sTime=U(pS,'uTime'),sDist=U(pS,'uDist'),sYaw=U(pS,'uYaw'),sPix=U(pS,'uPix'),sNoise=U(pS,'uNoise'),sAsp=U(pS,'uAsp'),sFoc=U(pS,'uFoc'),sLift=U(pS,'uLift');
    var qTex=U(pP,'uTex'),qRes=U(pP,'uRes'),qExpo=U(pP,'uExpo'),qTime=U(pP,'uTime'),qTS=U(pP,'uTS');
    var D0=(innerWidth/innerHeight)<1?62:30;
    T0=performance.now()-cssT();
    var last=performance.now(), slow=0, done=false, shown=false, opened=false;
    function ss(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x);}
    function frame(now){
      if(done) return;
      var t=(now-T0)/1000;
      if(now-last>70 && t>0.4){ if(++slow>3 && scale>0.36){ scale*=0.8; size(); slow=0; } }
      last=now;
      // approach, then fall into the shadow: dolly in and zoom until it fills the frame
      var e=Math.min(1,Math.max(0,(t-1.45)/0.6));
      var dist=D0*(1.14-0.14*ss(0,1.45,t))*(1-0.45*e*e);
      var foc=1.75*(1+6*e*e*e);
      var expo=ss(0,0.45,t)*(1+0.5*e*e);
      gl.bindFramebuffer(gl.FRAMEBUFFER,fbo); gl.viewport(0,0,TW,TH);
      gl.useProgram(pS);
      gl.uniform2f(sRes,TW,TH); gl.uniform1f(sAsp,W/H); gl.uniform1f(sTime,t+3.0); gl.uniform1f(sDist,dist);
      gl.uniform1f(sYaw,0.35+t*0.05+0.22*e*e); gl.uniform1f(sFoc,foc); gl.uniform1f(sLift,1.4/dist*e*e); gl.uniform1f(sPix,1/(foc*TH)); gl.uniform1i(sNoise,1);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,nt); gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES,0,3);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null); gl.viewport(0,0,W,H);
      gl.useProgram(pP);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,tex); gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(qTex,0); gl.uniform2f(qRes,W,H); gl.uniform2f(qTS,1/TW,1/TH); gl.uniform1f(qExpo,expo); gl.uniform1f(qTime,t);
      gl.drawArrays(gl.TRIANGLES,0,3);
      // swap the CSS scene for the ray-traced one only once a real frame exists
      if(!shown){ shown=true; d.classList.add('intro-gl'); }
      // inside the shadow: open the panels onto the page, then clean up
      if(t>2.0&&!opened){ opened=true; d.classList.add('intro-open'); }
      if(t>2.65){ done=true; d.classList.add('intro-done'); var x=gl.getExtension('WEBGL_lose_context'); if(x) x.loseContext(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function go(){ pS=link('#define STEPS '+steps+'\n'+SCENE_SRC); pP=link(POST_SRC); requestAnimationFrame(wait); }
  // With parallel compile the GPU builds the shaders in the background, so start now.
  // Without it compiling blocks, so wait for the first paint (the CSS scene shows meanwhile).
  if(par) go(); else requestAnimationFrame(go);
})();`;
export const BLACK_HOLE_SCRIPT = JS.replace("VERT_SRC", JSON.stringify(VERT))
  .replace("SCENE_SRC", JSON.stringify(SCENE))
  .replace("POST_SRC", JSON.stringify(POST));
