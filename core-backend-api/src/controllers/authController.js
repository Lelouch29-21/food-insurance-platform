import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { getCookieOptions, signAccessToken } from '../utils/tokens.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });
  const token = signAccessToken({ sub: user._id.toString(), role: user.role });

  res.cookie('accessToken', token, getCookieOptions());
  return res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signAccessToken({ sub: user._id.toString(), role: user.role });
  res.cookie('accessToken', token, getCookieOptions());

  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export function logout(req, res) {
  res.clearCookie('accessToken');
  return res.status(204).send();
}
