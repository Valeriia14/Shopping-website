import React, { Fragment, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  Link,
  Button,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import TrackOrder from './components/TrackOrder'
import FooterAccordion from './components/FooterAccordion'

const useStyles = makeStyles((theme) => ({
  footerCard: {
    borderRadius: '50px',
    borderWidth: '0',
    boxShadow: '0 22px 54px 0 rgba(77,95,111,.3)',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  footerCardText: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontWeight: 500,
    color: '#000',
  },
  linkText: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontWeight: 500,
    color: '#000',
    '&:hover': {
      color: '#4396c5',
    },
  },
  trackOrderSearch: {
    height: '30px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    background: '#eff0f4',
    borderRadius: '10px',
    padding: theme.spacing(1),
    width: '100%',
    fontSize: '16px',
  },
  subscribeBtn: {
    background: '#5dd087',
    padding: '12px 40px',
    fontSize: '16px',
    color: '#fff',
    boxShadow: '15px 11px 33px 0 rgba(126,194,151,.34)',
    borderRadius: '10em',
    height: '30px',
    marginTop: theme.spacing(1),
  },
  logoBrand: {
    maxWidth: '100%',
    display: 'block',
    objectFit: 'cover',
  },
}))

const FooterCard = (props) => {
  const classes = useStyles()
  const { logoBrand, contactMail, contactNumber } = props
  useEffect(() => {
    const script = document.createElement('script')

    script.src =
      'https://downloads.mailchimp.com/js/signup-forms/popup/unique-methods/embed.js'
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const showMailChipSub = () => {
    document.cookie =
      'MCPopupClosed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    document.cookie =
      'MCPopupSubscribed=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    window.dojoRequire(['mojo/signup-forms/Loader'], (loader) => {
      loader.start({
        baseUrl: 'mc.us11.list-manage.com',
        uuid: '8b4ce9bd389437230d7802bab',
        lid: '043cd6d9fa',
        uniqueMethods: true,
      })
    })
  }

  return (
    <Fragment>
      <Box className={classes.footerCard} p={4}>
        <img
          src={logoBrand}
          className={classes.logoBrand}
        />
        <Typography variant="subtitle2">Account</Typography>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.linkText}>
            Account &amp; Order History
          </Typography>
        </Link>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.linkText}>
            Kidztime SMILES Rewards
          </Typography>
        </Link>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.linkText}>
            Contact Us &amp; FAQ
          </Typography>
        </Link>
        <Typography variant="subtitle2">Contact Us</Typography>
        <Typography variant="body2" className={classes.footerCardText}>
          Tel: {contactNumber}
        </Typography>
        <Typography variant="body2" className={classes.footerCardText}>
          Email: {contactMail}
        </Typography>
        <Typography variant="subtitle2">Track your order</Typography>
        <OutlinedInput
          className={classes.trackOrderSearch}
          endAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
        <Typography variant="subtitle2">Subscribe To Kidztime</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => showMailChipSub()}
          className={classes.subscribeBtn}
        >
          Subscribe
        </Button>
      </Box>
      <FooterAccordion />
      <TrackOrder />
    </Fragment>
  )
}

export default FooterCard
