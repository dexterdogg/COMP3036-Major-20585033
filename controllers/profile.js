import { findUserById } from '../services/users.js';
import { getPurchasesByUserId } from '../models/purchaseModels.js';

export async function showProfile(req, res) {
  try {
    if (!req.user?.id) {
      return res.redirect('/login');
    }

    const me = await findUserById(Number(req.user.id));

    if (!me) {
      return res.redirect('/login');
    }

    const viewUser = {
      id: me.id,
      email: me.email,
      role: me.role,
      firstName: me.first_name,
      lastName: me.last_name
    };

    const purchases = await getPurchasesByUserId(viewUser.id);

    return res.render('profile', {
      title: 'My Account',
      me: viewUser,
      isAuthed: true,
      registeredEvents,
      purchases
    });
  } catch (err) {
    console.error('showProfile error:', err);

    return res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load profile.',
      error: {
        status: 500,
        message: 'Failed to load profile.',
        stack: ''
      }
    });
  }
}