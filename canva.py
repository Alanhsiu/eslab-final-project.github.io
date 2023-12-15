from vpython import *

class basketball():
    # 創建畫布
    scene = canvas(title='3D Basketball Court', width=1200, height=600)
    heightadjust = -3

    # 生成籃球場地板
    court = box(pos=vector(0, heightadjust, 0), size=vector(7.5, 0.1, 7), color=color.white)
    center = -court.size.z/2
    """_summary_
    """
    # 生成籃框和籃球架
    backboard = box(pos=vector(0, 3.5+heightadjust, center +1.2), size=vector(1.8, 1.2, 0.1), color=color.white)
    hoop = ring(pos=vector(0, 3.05+heightadjust, backboard.pos.z+0.23+0.69), axis=vector(0, 0.01, 0), radius = 0.69, thickness=0.03, color=color.red)

    # generate the paint area
    paint1 = box(pos = vector(4.9/2-0.05, heightadjust,center+5.8/2), size = vector(0.1, 0.1, 5.8), color = color.red, opacity = 1)
    paint2 = box(pos = vector(-4.9/2+0.05, heightadjust,center+5.8/2), size = vector(0.1, 0.1, 5.8), color = color.red, opacity = 1)
    paint3 = box(pos = vector(0, heightadjust,5.8/2-0.05+center+5.8/2), size = vector(4.9, 0.1, 0.1), color = color.red, opacity = 1)
    # paint4 = box(pos = vector(0, heightadjust,-5.8/2+0.05+center+5.8/2), size = vector(4.9, 0.1, 0.1), color = color.red, opacity = 1)


    # generate the connecting rod
    rod = cylinder(pos=vector(0, 3.05+heightadjust, backboard.pos.z+0.05), axis = vector(0, 0, 0.18), radius = 0.03, color=color.red, opacity =1)
    pillar = cylinder(pos=vector(0, heightadjust, backboard.pos.z-0.2), axis = vector(0, 3.3,0), radius = 0.2, color = color.cyan)

    # 生成籃球
    basketball = sphere(pos=vector(0, 2.1+heightadjust, 2.9-0.12), radius=0.12, color=color.orange, make_trail=True, trail_color=color.white)
    basketball.m = 0.0062 


    def shoot(self, ax = 0, ay = 0, az = 0):
        # initial position of the ball
        self.basketball.pos = vector(0, 1.9+self.heightadjust, 2.9-0.12)
        
        # 球的初始速度和加速度
        self.basketball.velocity = vector(ay*0.0003, az*0.004, ax*(-0.002))
        g = vector(0, -9.8, 0)

        # parameters for the ball
        C_d = 0.53
        rho = 1.293
        S = ((self.basketball.radius)**2)*pi
        k = 0.5*C_d*rho*S

        # 更新球的運動
        dt = 0.001  # 時間步長
        maxheight = 0
        while True:
            rate(1000)  # 控制動畫更新速度
            self.basketball.make_trail = False
           
            if self.basketball.velocity.x > 0:
                f_x = -k*(self.basketball.velocity.x**2)
            else :
                f_x = k*(self.basketball.velocity.x**2)
                
            if self.basketball.velocity.y > 0:
                f_y = -k*(self.basketball.velocity.y**2)
            else :
                f_y = k*(self.basketball.velocity.y**2)
            
            if self.basketball.velocity.z > 0:
                f_z = -k*(self.basketball.velocity.z**2)
            else :
                f_z = k*(self.basketball.velocity.z**2)
            # print(type(f_x))
            ax_f = f_x/self.basketball.m
            ay_f = f_y/self.basketball.m
            az_f = f_z/self.basketball.m
            
            
            if(self.basketball.pos.y <= self.hoop.pos.y and mag(self.basketball.pos - self.hoop.pos) <= self.hoop.radius-self.basketball.radius):
                # display successful on the canvas
                print("successful")
                break
            # else:
            #     if(mag(self.basketball.pos - hop))
            
            self.basketball.pos += self.basketball.velocity * dt
            if(self.basketball.pos.y > maxheight):
                maxheight = self.basketball.pos.y
                
            
            self.basketball.velocity += g * dt
            # self.basketball.velocity.x += ax_f*dt
            # self.basketball.velocity.y += ay_f*dt
            # self.basketball.velocity.z += az_f*dt
            
            # 如果球碰到地板，反彈
            if self.basketball.pos.y < self.basketball.radius+self.heightadjust and self.basketball.velocity.y < 0:
                self.basketball.velocity.y *= -1

            
            # if basketball.pos.z >= backboard.pos.z:
            #     basketball.velocity.z == 0
            
            # if the ball is near the courtside, stop
            if self.basketball.pos.x > 3.75:
                
                break
            elif self.basketball.pos.x < -3.75:
              
                break
            elif self.basketball.pos.z > 3.5:
              
                break
            elif self.basketball.pos.z < -3.5+self.basketball.radius:
                
                break
            
            
            if (self.basketball.pos.z <= self.backboard.pos.z+0.05+self.basketball.radius+0.05) and (self.basketball.pos.y <= self.backboard.pos.y+self.backboard.size.y/2) and (self.basketball.pos.y >= self.backboard.pos.y-self.backboard.size.y/2) and self.basketball.velocity.z < 0:
                self.basketball.velocity.z *= -1 
                
            
        # print(maxheight)
            
            
            
        