package com.dharshanapharmacy.configuration;



import com.dharshanapharmacy.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MyUserDetailsService userDetailsService;



    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.
                authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/forgotpassword").permitAll()

                .antMatchers("/item/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/subitem/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/batch/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/inventorydrug/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/inventorygrocery/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/inventorygrocery/byitemname/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PHARMACIST","INTERNPHARMACIST")

                .antMatchers("/supplier/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/quotationrequest/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/quotation/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/porder/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/grn/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/supplierreturn/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/spayment/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")

                .antMatchers("/customer/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/corder/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/invoice/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/cpayment/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST")

                .antMatchers("/vehicle/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/distribution/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST")

                .antMatchers("/inventorysearch/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/financialreport/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/supplierarresreport/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")

                .antMatchers("/user/**","/employee/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/mainwindow").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST")
                .antMatchers("/privilage/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","PHARMACIST","INTERNPHARMACIST").anyRequest().authenticated()
                .and().csrf().disable().formLogin()
                .loginPage("/login")
                .failureHandler((request, response, exception) -> {
                    System.out.println(exception.getMessage());
                    System.out.println(response.getStatus());
                    String redirectUrl = new String();
                    if(exception.getMessage() == "User is disabled"){
                        redirectUrl = request.getContextPath() + "/login?error=notactive";
                    }else if(exception.getMessage() == "Bad credentials"){
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                    }else if(exception.getMessage() == null){
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                    }
                    response.sendRedirect(redirectUrl);
                })
                .defaultSuccessUrl("/mainwindow", true)
                .usernameParameter("username")
                .passwordParameter("password")
                .and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login").and().exceptionHandling().accessDeniedPage("/access-denied").and()
                .sessionManagement()
                .invalidSessionUrl("/login")
                .sessionFixation()
                .changeSessionId()
                .maximumSessions(6)
                .expiredUrl("/login").maxSessionsPreventsLogin(true);
        ;
        http.headers()
                .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN));
    }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
/*    @Bean
    public ViewResolver internalResourceViewResolver() {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();
        bean.setPrefix("/resources/**");
        bean.setSuffix(".html");
        return bean;
    }*/

}
