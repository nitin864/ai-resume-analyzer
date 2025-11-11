import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('/auth', 'routes/auth.tsx'),
  route('/home', 'routes/homemain.tsx'),
  route('/upload', 'routes/upload.tsx'),
  route('/resume/:id', 'routes/resume.tsx')
] satisfies RouteConfig;
