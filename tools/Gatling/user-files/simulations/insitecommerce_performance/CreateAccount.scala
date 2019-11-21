package insitecommerce_performance

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class CreateAccount extends Simulation {

  val httpProtocol = http
    .baseURL("http://host.docker.internal")
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .doNotTrackHeader("1")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0")
    .disableCaching

  val userNameFeeder = Iterator.from(0).map(i => Map("userName" -> f"test$i%03d"))

  val scn = scenario("CreateAccount")
    .feed(userNameFeeder)
    .exec(AnonymousRequests.firstHome)
    .pause(1)
    .exec(AnonymousRequests.signInPage)
    .pause(1)
    .exec(AnonymousRequests.createAccountPage)
    .pause(1)
    .exec(AnonymousRequests.createAccount)
    .exec(AnonymousRequests.signIn)
    .exec(AuthenticatedRequests.firstHome)

  setUp(scn.inject(rampUsers(100) over (30 seconds))).protocols(httpProtocol)
}