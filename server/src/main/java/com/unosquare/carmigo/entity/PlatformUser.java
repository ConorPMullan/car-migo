package com.unosquare.carmigo.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.ToString.Exclude;
import org.hibernate.Hibernate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import java.time.Instant;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "platform_user")
public class PlatformUser
{
    @Id
    @SequenceGenerator(name = "platform_user_id_seq",
            sequenceName = "platform_user_id_seq",
            allocationSize = 1)
    @GeneratedValue(generator = "platform_user_id_seq", strategy = GenerationType.SEQUENCE)
    @Column(name = "id", updatable = false, nullable = false)
    private int id;

    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "dob", nullable = false)
    private Instant dob;

    private static String EMAIL_PATTERN = "^([^ @])+@([^ \\.@]+\\.)+([^ \\.@])+$";

//    @Email or
//    @Pattern(regexp = EMAIL_PATTERN, message = "Please provide a valid email address") String email)
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Exclude
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_access_status_id", nullable = false)
    private UserAccessStatus userAccessStatus;

    @Override
    public boolean equals(final Object o)
    {
        if (this == o) {
            return true;
        }
        if (null == o || Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        final PlatformUser that = (PlatformUser) o;
        return 0 != id && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode()
    {
        return getClass().hashCode();
    }
}
